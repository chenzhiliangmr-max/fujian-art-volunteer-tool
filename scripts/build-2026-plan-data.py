import importlib.util
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COMPARE_SCRIPT = ROOT / "scripts" / "compare-2026-plan-vs-2025-admission.py"
OUT_JS = ROOT / "shared" / "fujian-art-plan-2026.js"
OUT_AUDIT = ROOT / "outputs" / "fujian-art-2026-plan-import-audit.csv"


def load_compare_module():
    spec = importlib.util.spec_from_file_location("plan_compare", COMPARE_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def score(value):
    return None if value in (None, "") else float(value)


def fmt_score(value):
    if value is None:
        return ""
    return f"{float(value):.2f}".rstrip("0").rstrip(".")



def clean_plan_text(value):
    text = "" if value is None else str(value).strip()
    text = re.sub("[" + chr(0xFF1B) + ";]?" + r"\s*3" + chr(0x6C81) + r"/\s*$", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def clean_tags(tags):
    return sorted({tag for tag in tags if tag})


def make_tags(row):
    text = "".join(str(row.get(key) or "") for key in ("school", "level", "major", "note"))
    tags = ["official", "plan2026"]
    if "公办" in text:
        tags.append("public")
    if "民办" in text or "独立" in text:
        tags.append("private")
    if "中外" in text or "合作" in text:
        tags.append("coop")
    if "985" in text:
        tags.append("985")
    if "211" in text:
        tags.append("211")
    if "双一流" in text:
        tags.append("double")
    return clean_tags(tags)


def choose_reference(matches):
    if not matches:
        return None
    with_score = [row for row in matches if row.get("min") is not None]
    return with_score[0] if with_score else matches[0]


def build_info(row, ref):
    plan_text = f"计划{row.get('plan_count') or ''}".rstrip()
    if ref:
        ref_text = (
            f"2025参考最低分 {fmt_score(ref.get('min'))}"
            + (f"-{fmt_score(ref.get('max'))}" if ref.get("max") else "")
        )
    else:
        ref_text = "新增/暂无2025录取参考"
    pieces = [row["major"], plan_text, ref_text]
    if row.get("tuition"):
        pieces.append(f"学费{row['tuition']}")
    if row.get("duration"):
        pieces.append(f"学制{row['duration']}")
    note = clean_plan_text(row.get("note"))
    if note:
        pieces.append(note)
    return "，".join(piece for piece in pieces if piece)


def build_plan_data():
    cmp = load_compare_module()
    plan_rows = cmp.read_2026_plan()
    admission_rows = cmp.read_2025_admission()
    admission_exact = cmp.index_rows(admission_rows, cmp.make_key)
    admission_base = cmp.index_rows(admission_rows, cmp.make_base_key)

    items = []
    audit_rows = []
    matched = 0
    unmatched = 0
    for row in plan_rows:
        mode, matches = cmp.best_match(row, admission_exact, admission_base)
        ref = choose_reference(matches)
        if ref:
            matched += 1
        else:
            unmatched += 1
        item = {
            "school": row["school"],
            "province": row["province"],
            "level": row["level"],
            "year": 2026,
            "planYear": 2026,
            "referenceYear": 2025,
            "program": row["major"],
            "major": row["major"],
            "schoolCode": row["school_code"],
            "majorGroup": row["group"],
            "majorCode": row["major_code"],
            "planCount": row["plan_count"],
            "duration": row["duration"],
            "tuition": row["tuition"],
            "note": clean_plan_text(row["note"]),
            "site": row["site"],
            "page": row["page"],
            "info": build_info(row, ref),
            "subject": row["subject"],
            "min": score(ref.get("min")) if ref else None,
            "max": score(ref.get("max")) if ref else None,
            "avg": score(ref.get("avg")) if ref else None,
            "referenceAdmissionCount": ref.get("admit_count") if ref else None,
            "referenceMajor": ref.get("major") if ref else "",
            "matchMode": mode,
            "status": "2026招生计划；2025录取参考" if ref else "2026招生计划；新增/暂无2025录取参考",
            "source": "2026福建招生计划（用户核验PLAN_DRAFT）",
            "tags": make_tags(row) + ([] if ref else ["new2026"]),
        }
        items.append(item)
        audit_rows.append(
            [
                row["subject"],
                row["school"],
                row["major"],
                row.get("plan_count") or "",
                mode,
                ref.get("major") if ref else "",
                ref.get("min") if ref else "",
                ref.get("admit_count") if ref else "",
            ]
        )

    payload = {
        "generatedFrom": "outputs/fujian-art-2026-plan-review-draft.xlsx#PLAN_DRAFT",
        "planYear": 2026,
        "referenceYear": 2025,
        "count": len(items),
        "matchedTo2025": matched,
        "unmatchedTo2025": unmatched,
        "items": items,
    }
    js = (
        "/* Generated by scripts/build-2026-plan-data.py. Do not edit by hand. */\n"
        "(function(){\n"
        "  const payload = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
        "  if (typeof window !== \"undefined\") window.FujianArtPlan2026 = payload;\n"
        "  if (typeof module !== \"undefined\") module.exports = payload;\n"
        "})();\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")

    with OUT_AUDIT.open("w", encoding="utf-8-sig", newline="") as fh:
        fh.write("subject,school,major,plan_count,match_mode,reference_major,reference_min,reference_admit_count\n")
        for row in audit_rows:
            fh.write(",".join('"' + str(value).replace('"', '""') + '"' for value in row) + "\n")

    print(json.dumps({"items": len(items), "matched": matched, "unmatched": unmatched}, ensure_ascii=False))


if __name__ == "__main__":
    build_plan_data()
