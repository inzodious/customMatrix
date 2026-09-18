import glob
import json
import os
import re
import shutil

import generate_mock_income_statement as gen
import mode_theme

TEMPLATE_SM = r"C:\Users\JoshuaBiondo\OneDrive - CuraLinc Healthcare\Fabric - Documents\04-Technical\reports\ur-reports\UR Dashboard - 3.0.SemanticModel"
TEMPLATE_RPT = r"C:\Users\JoshuaBiondo\OneDrive - CuraLinc Healthcare\Fabric - Documents\04-Technical\reports\ur-reports\UR Dashboard - 3.0.Report"

DEST_ROOT = r"C:\Users\JoshuaBiondo\Documents\customMatrix\assets\pbi\report"
DEST_SM = os.path.join(DEST_ROOT, "Harborlight Coffee - Income Statement.SemanticModel")
DEST_RPT = os.path.join(DEST_ROOT, "Harborlight Coffee - Income Statement.Report")

TEMPLATE_TABLES = ["dim_icons", "dim_calendar", "dim_last_refresh", "cg_time_intelligence"]
MEASURE_TABLES = ["_measures_format", "_measures_kpi"]
COFFEE_TABLES = ["fact_income_statement", "dim_locations", "IncomeStatementLayout", "dim_mode"]

DETAIL_PAGE = "319f29dbfa9e54545e93"
PAGE_ID = "6b60d82e48507e79d910"
MATRIX_ID = "4ca1a79c4117af340514"

CATEGORY_MAP = {
    "Beverage Sales": ("Revenue", 1, "Beverage Sales", 1),
    "Food Sales": ("Revenue", 1, "Food Sales", 2),
    "Retail Sales": ("Revenue", 1, "Retail Sales", 3),
    "Other Income": ("Revenue", 1, "Other Income", 4),
    "Cost of Goods Sold": ("Cost of Goods Sold", 2, "Cost of Goods Sold", 5),
    "Labor": ("Operating Expenses", 3, "Labor", 6),
    "Occupancy": ("Operating Expenses", 3, "Occupancy", 7),
    "Operating Expenses": ("Operating Expenses", 3, "Operating Costs", 8),
    "General & Administrative": ("Operating Expenses", 3, "General & Administrative", 9),
}

DISPLAY_NAMES = {
    "rev_drip_coffee": "Drip Coffee",
    "rev_espresso_drinks": "Espresso Drinks",
    "rev_cold_brew": "Cold Brew & Iced Coffee",
    "rev_specialty_seasonal": "Specialty & Seasonal Beverages",
    "rev_tea": "Tea Sales",
    "rev_pastries": "Pastries & Baked Goods",
    "rev_sandwiches": "Sandwiches & Wraps",
    "rev_breakfast": "Breakfast Items",
    "rev_snacks": "Snacks & Grab-and-Go",
    "rev_whole_bean": "Whole Bean Coffee Bags",
    "rev_brew_equipment": "Brewing Equipment & Accessories",
    "rev_merchandise": "Merchandise & Apparel",
    "rev_gift_cards": "Gift Card Redemptions",
    "rev_catering": "Catering Revenue",
    "rev_wholesale": "Wholesale & Bulk Sales",
    "exp_coffee_beans": "Coffee Beans",
    "exp_dairy": "Dairy & Milk Alternatives",
    "exp_syrups": "Syrups & Flavorings",
    "exp_food_ingredients": "Food & Bakery Ingredients",
    "exp_packaging": "Packaging & Disposables",
    "exp_retail_cogs": "Retail Merchandise COGS",
    "exp_barista_wages": "Barista Wages",
    "exp_shift_lead_wages": "Shift Lead Wages",
    "exp_store_manager_salary": "Store Manager Salary",
    "exp_payroll_taxes": "Payroll Taxes",
    "exp_employee_benefits": "Employee Benefits",
    "exp_overtime": "Overtime Pay",
    "exp_rent": "Rent",
    "exp_utilities": "Utilities",
    "exp_property_insurance": "Property Insurance",
    "exp_cam": "Common Area Maintenance",
    "exp_property_tax": "Property Tax",
    "exp_marketing": "Marketing & Advertising",
    "exp_pos_software": "POS & Software Subscriptions",
    "exp_equipment_maintenance": "Equipment Maintenance & Repairs",
    "exp_cleaning": "Cleaning & Janitorial",
    "exp_cc_fees": "Credit Card Processing Fees",
    "exp_office_supplies": "Office Supplies",
    "exp_waste_removal": "Waste Removal",
    "exp_corporate_overhead": "Corporate Overhead Allocation",
    "exp_training": "Training & Development",
    "exp_general_liability_ins": "General Liability Insurance",
    "exp_bank_fees": "Bank & Merchant Fees",
    "exp_depreciation": "Depreciation & Amortization",
    "exp_professional_fees": "Professional Fees (Legal/Accounting)",
}

BLOCK_START = re.compile(r"^\t(measure|column|partition|annotation|calculationGroup|hierarchy) ")


def read_text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write_text(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def split_blocks(text):
    head, blocks, current = [], [], None
    for line in text.split("\n"):
        if BLOCK_START.match(line):
            if current is not None:
                blocks.append(current)
            current = [line]
        elif current is not None:
            current.append(line)
        else:
            head.append(line)
    if current is not None:
        blocks.append(current)
    return head, blocks


def block_kind(block):
    return BLOCK_START.match(block[0]).group(1)


def block_name(block):
    return block[0].split(None, 2)[1].strip("'").split(" =")[0].strip("'")


def table_refs(text):
    refs = set()
    for m in re.finditer(r"'([^']+)'\[", text):
        refs.add(m.group(1))
    for m in re.finditer(r"(?<![\w'])(\w+)\[", text):
        refs.add(m.group(1))
    return refs


def measure_refs(text):
    return {m.group(1) for m in re.finditer(r"(?<![\w\]'])\[(\w+)\]", text)}


def filter_measures(path, allowed_tables, drop_names):
    head, blocks = split_blocks(read_text(path))
    measures, others = {}, []
    for block in blocks:
        if block_kind(block) == "measure":
            measures[block_name(block)] = block
        else:
            others.append(block)

    surviving = set(measures) - set(drop_names)
    changed = True
    while changed:
        changed = False
        for name in sorted(surviving):
            body = "\n".join(measures[name])
            if table_refs(body) - allowed_tables or (measure_refs(body) & set(measures)) - surviving:
                surviving.discard(name)
                changed = True
    return head, measures, others, surviving


def emit_table(head, measures, others, surviving, extra_blocks):
    parts = ["\n".join(head).rstrip("\n")]
    for name in measures:
        if name in surviving:
            parts.append("\n".join(measures[name]).rstrip("\n"))
    parts.extend(b.rstrip("\n") for b in extra_blocks)
    parts.extend("\n".join(b).rstrip("\n") for b in others)
    return "\n\n".join(parts) + "\n"


def layout_rows():
    rows = []
    order = 0
    for key, cat, _base in gen.REVENUE_ITEMS + gen.EXPENSE_ITEMS:
        section, section_order, category, category_order = CATEGORY_MAP[cat]
        order += 1
        rows.append((key, section, section_order, category, category_order, DISPLAY_NAMES[key], order))
    return rows


LAYOUT_HEAD = '''table IncomeStatementLayout
	lineageTag: b21652b9-6562-4d16-a7ed-114a2315abfb

	column line_item_key
		dataType: string
		isHidden
		isKey
		lineageTag: 58daa979-f1fd-463f-9599-654554a04fdc
		summarizeBy: none
		isNameInferred
		sourceColumn: [line_item_key]

		annotation SummarizationSetBy = Automatic

	column section
		dataType: string
		lineageTag: 4b6c0526-7a5e-4f1f-87a7-77dd9eadaac8
		summarizeBy: none
		isNameInferred
		sourceColumn: [section]
		sortByColumn: section_order

		changedProperty = SortByColumn

		annotation SummarizationSetBy = Automatic

	column section_order
		dataType: int64
		isHidden
		formatString: 0
		lineageTag: 6762a7ea-eeb2-44a0-a610-988608e47efd
		summarizeBy: sum
		isNameInferred
		sourceColumn: [section_order]

		annotation SummarizationSetBy = Automatic

	column category
		dataType: string
		lineageTag: a9566b53-4499-41c8-ae54-af174c63d0de
		summarizeBy: none
		isNameInferred
		sourceColumn: [category]
		sortByColumn: category_order

		changedProperty = SortByColumn

		annotation SummarizationSetBy = Automatic

	column category_order
		dataType: int64
		isHidden
		formatString: 0
		lineageTag: 169b48bf-6f92-49c4-abf0-4ecf040f8af1
		summarizeBy: sum
		isNameInferred
		sourceColumn: [category_order]

		annotation SummarizationSetBy = Automatic

	column line_item
		dataType: string
		lineageTag: cd9e0e4d-805e-486a-b9e7-a491d7b29393
		summarizeBy: none
		isNameInferred
		sourceColumn: [line_item]
		sortByColumn: line_item_order

		changedProperty = SortByColumn

		annotation SummarizationSetBy = Automatic

	column line_item_order
		dataType: int64
		isHidden
		formatString: 0
		lineageTag: bb78f058-7dfa-46a2-afe4-9f98aea5c93e
		summarizeBy: sum
		isNameInferred
		sourceColumn: [line_item_order]

		annotation SummarizationSetBy = Automatic

	partition IncomeStatementLayout = calculated
		mode: import
		source = ```
				DATATABLE (
				    "line_item_key", STRING,
				    "section", STRING,
				    "section_order", INTEGER,
				    "category", STRING,
				    "category_order", INTEGER,
				    "line_item", STRING,
				    "line_item_order", INTEGER,
				    {
'''

LAYOUT_TAIL = '''
				    }
				)
				```

	annotation PBI_ResultType = Table
'''


def build_layout_tmdl():
    body = ",\n".join('\t\t\t\t    { "%s", "%s", %d, "%s", %d, "%s", %d }' % r for r in layout_rows())
    return LAYOUT_HEAD + body + LAYOUT_TAIL


IM_MEASURES = """	measure im_amount = SUM ( fact_income_statement[amount] )
		formatString: \\$#,0;(\\$#,0);\\$#,0
		displayFolder: Income Statement
		lineageTag: aa9a4777-60de-4e8f-923b-cf516ea0e743

	measure im_location_count = DISTINCTCOUNT ( dim_locations[location_id] )
		formatString: #,0
		displayFolder: Income Statement
		lineageTag: e02e602b-76ff-413d-ac42-3e4b886b3724"""

FMT_LOCATION_MEASURES = """	measure fmt_location = SELECTEDVALUE ( dim_locations[location_name], "All" )
		lineageTag: 8f252b57-2585-4361-9486-d8e9a8b01eee

	measure fmt_region = SELECTEDVALUE ( dim_locations[region], "All" )
		lineageTag: 7be669de-2519-44f4-943c-b172f575b89c

	measure fmt_state = SELECTEDVALUE ( dim_locations[state], "All" )
		lineageTag: 1cd3d182-ea1e-4d97-ba4f-cad3dd541af0

	measure fmt_market_tier = SELECTEDVALUE ( dim_locations[market_tier], "All" )
		lineageTag: 087060b8-791a-4c74-acf9-7ed85ba75f21"""

P_DATA_FOLDER = """
expression p_data_folder = "C:\\Users\\JoshuaBiondo\\Documents\\customMatrix\\assets\\pbi\\data\\" meta [IsParameterQuery=true, Type="Text", IsParameterQueryRequired=true]
	lineageTag: 8d21429a-5c52-42fd-b463-86e81bf81289
	queryGroup: Parameters

	annotation PBI_ResultType = Text
"""

RELATIONSHIPS = """relationship 35f37e33-e51f-410b-8f51-f1e683d4ce58
	fromColumn: fact_income_statement.month_end
	toColumn: dim_calendar.date

relationship bbf8f185-2348-4290-a5d3-4f9fd2c88a1e
	fromColumn: fact_income_statement.location_id
	toColumn: dim_locations.location_id

relationship 7c2f4a19-83be-4d51-9e6a-2f5c81d0b463
	fromColumn: fact_income_statement.line_item_key
	toColumn: IncomeStatementLayout.line_item_key
"""


def adapt_applied_filters(block_lines):
    text = "\n".join(block_lines)
    text = text.replace("VAR vGroup = [fmt_client_group]", "VAR vGroup = [fmt_region]")
    text = text.replace("VAR vIndustry = [fmt_industry]", "VAR vIndustry = [fmt_state]")
    text = text.replace("VAR vClient = [fmt_client]", "VAR vClient = [fmt_location]")
    text = text.replace("VAR vStatus = [fmt_account_type]", "VAR vStatus = [fmt_market_tier]")
    text = text.replace("VAR vRunGroup = [fmt_run_group]", 'VAR vRunGroup = "All"')
    text = text.replace("Run Group:", "Run Group").replace("Group:", "Region:").replace("Industry:", "State:")
    text = text.replace("Org:", "Location:").replace("Type:", "Tier:")
    return text


def build_model_tmdl(all_tables):
    order = json.dumps(all_tables + ["p_sql_endpoint", "p_lakehouse", "p_start_date", "p_data_folder"])
    refs = "\n".join("ref table " + t for t in all_tables)
    return """model Model
	culture: en-US
	defaultPowerBIDataSourceVersion: powerBI_V3
	discourageImplicitMeasures
	sourceQueryCulture: en-US
	dataAccessOptions
		legacyRedirects
		returnErrorValuesAsNull

queryGroup Parameters

	annotation PBI_QueryGroupOrder = 0

queryGroup Facts

	annotation PBI_QueryGroupOrder = 1

queryGroup Dimension

	annotation PBI_QueryGroupOrder = 2

annotation PBI_QueryOrder = %s

annotation __PBI_TimeIntelligenceEnabled = 0

annotation PBI_ProTooling = ["DaxQueryView_Desktop","TMDLView_Desktop","DevMode","WebModelingEdit"]

%s
""" % (order, refs)


def build_semantic_model():
    src_tables = os.path.join(TEMPLATE_SM, "definition", "tables")
    dst_tables = os.path.join(DEST_SM, "definition", "tables")

    for name in TEMPLATE_TABLES:
        shutil.copyfile(os.path.join(src_tables, name + ".tmdl"), os.path.join(dst_tables, name + ".tmdl"))

    write_text(os.path.join(dst_tables, "IncomeStatementLayout.tmdl"), build_layout_tmdl())
    write_text(os.path.join(dst_tables, "dim_mode.tmdl"), mode_theme.build_dim_mode_tmdl())

    allowed = set(TEMPLATE_TABLES) | set(MEASURE_TABLES) | set(COFFEE_TABLES)
    report = {}

    for name in MEASURE_TABLES:
        drop = ["fmt_applied_filters"] if name == "_measures_format" else []
        head, measures, others, surviving = filter_measures(
            os.path.join(src_tables, name + ".tmdl"), allowed, drop)
        if name == "_measures_kpi":
            extra = [IM_MEASURES]
        else:
            applied = mode_theme.theme_applied_filters(adapt_applied_filters(measures["fmt_applied_filters"]))
            extra = [FMT_LOCATION_MEASURES, mode_theme.mode_measures_tmdl(), applied]
        write_text(os.path.join(dst_tables, name + ".tmdl"),
                   emit_table(head, measures, others, surviving, extra))
        report[name] = sorted(surviving)

    expressions = read_text(os.path.join(TEMPLATE_SM, "definition", "expressions.tmdl")).rstrip("\n")
    write_text(os.path.join(DEST_SM, "definition", "expressions.tmdl"), expressions + "\n" + P_DATA_FOLDER)
    shutil.copyfile(os.path.join(TEMPLATE_SM, "definition", "database.tmdl"),
                    os.path.join(DEST_SM, "definition", "database.tmdl"))
    write_text(os.path.join(DEST_SM, "definition", "model.tmdl"),
               build_model_tmdl(MEASURE_TABLES + TEMPLATE_TABLES + COFFEE_TABLES))
    write_text(os.path.join(DEST_SM, "definition", "relationships.tmdl"), RELATIONSHIPS)
    return report


def field_column(entity, prop, native):
    return {
        "field": {"Column": {"Expression": {"SourceRef": {"Entity": entity}}, "Property": prop}},
        "queryRef": entity + "." + prop,
        "nativeQueryRef": native,
        "active": True,
        "displayName": native,
    }


def field_measure(entity, prop, native):
    return {
        "field": {"Measure": {"Expression": {"SourceRef": {"Entity": entity}}, "Property": prop}},
        "queryRef": entity + "." + prop,
        "nativeQueryRef": native,
        "displayName": native,
    }


def load_template_visual(src_pages, vid):
    visual = json.loads(read_text(os.path.join(src_pages, "visuals", vid, "visual.json")))
    visual.pop("filterConfig", None)
    v = visual["visual"]
    v.pop("expansionStates", None)
    v.pop("syncGroup", None)
    v.get("objects", {}).pop("columnWidth", None)
    for entry in v.get("objects", {}).get("general", []):
        entry.get("properties", {}).pop("filter", None)
    return visual


def audit_entities(dst_root, tables):
    dangling = {}
    for path in glob.glob(os.path.join(dst_root, "definition", "**", "*.json"), recursive=True):
        missing = set(re.findall(r'"Entity":\s*"([^"]+)"', read_text(path))) - tables
        if missing:
            dangling[os.path.basename(os.path.dirname(path))] = sorted(missing)
    if dangling:
        raise ValueError("dangling entity references: %s" % dangling)
    return True


SLICER_REBINDS = [
    ("b7ebccf7f9dfb4e55973", None, "Month"),
    ("37865d87503e0d7e45c8", [("dim_locations", "region", "Region")], "Region"),
    ("2e19d71efdd4880608ac", [("dim_locations", "location_name", "Location")], "Location"),
    ("8cca2c641a6ca94cf2ce", [("dim_locations", "market_tier", "Tier")], "Store Tier"),
    ("90bda6f3c90a956e50f6", [("dim_locations", "state", "State")], "State"),
    ("53eec351715073db9723", [("IncomeStatementLayout", "section", "Section")], "P&L Section"),
    ("c9c3bbac334ae8a82083", [("IncomeStatementLayout", "category", "Category")], "Category"),
    (mode_theme.MODE_SLICER_ID, [("dim_mode", "mode", "Mode")], "Display Mode"),
]

CHROME_SHAPES = {
    "c183d1a1a9c4ce56ee01": "header_background",
    "f99c7e577bd3d5e8e3c6": "rail_background",
}

PAGE_NAVIGATORS = {
    "798dd353428f6b9a63f9": "rail_background",
    "9add25db8f36d277df68": "page_background",
}

PASSTHROUGH = [
    "c183d1a1a9c4ce56ee01",
    "f99c7e577bd3d5e8e3c6",
    "2be479267a27909683d7",
    "eab9c6c6c124498ae4ff",
    "3101fa9d3e82513ce370",
    "798dd353428f6b9a63f9",
    "9add25db8f36d277df68",
    "319f29dbfa9e00000029",
    "244d14c2a0f40ebc3171",
    "605295862df5ba99e4e5",
    "811cbf17fd7d1512c3cc",
    "13b5546e2ece49b7c12a",
]


def build_report():
    src_pages = os.path.join(TEMPLATE_RPT, "definition", "pages", DETAIL_PAGE)
    dst_page = os.path.join(DEST_RPT, "definition", "pages", PAGE_ID)
    if os.path.isdir(os.path.join(dst_page, "visuals")):
        shutil.rmtree(os.path.join(dst_page, "visuals"))

    emitted = []

    backdrop = mode_theme.backdrop_visual()
    write_text(os.path.join(dst_page, "visuals", mode_theme.BACKDROP_ID, "visual.json"),
               json.dumps(backdrop, indent=2))
    emitted.append(mode_theme.BACKDROP_ID)

    for vid in PASSTHROUGH:
        visual = load_template_visual(src_pages, vid)
        if vid == "2be479267a27909683d7":
            runs = visual["visual"]["objects"]["general"][0]["properties"]["paragraphs"][0]["textRuns"]
            runs[0]["value"] = "Harborlight Coffee"
            runs[0].setdefault("textStyle", {})["color"] = mode_theme.CHROME_TEXT
        if vid in CHROME_SHAPES:
            mode_theme.theme_shape(visual, CHROME_SHAPES[vid])
        if vid == "811cbf17fd7d1512c3cc":
            mode_theme.theme_card(visual)
        if vid in PAGE_NAVIGATORS:
            mode_theme.theme_page_navigator(visual, PAGE_NAVIGATORS[vid])
        if vid == "244d14c2a0f40ebc3171":
            mode_theme.theme_button(visual)
        if vid == "319f29dbfa9e00000029":
            mode_theme.theme_label(visual)
        if vid == "f99c7e577bd3d5e8e3c6":
            visual["position"]["z"] = 5
        write_text(os.path.join(dst_page, "visuals", vid, "visual.json"), json.dumps(visual, indent=2))
        emitted.append(vid)

    for vid, fields, header_text in SLICER_REBINDS:
        visual = load_template_visual(src_pages, vid)
        if fields is not None:
            visual["visual"]["query"]["queryState"]["Values"] = {
                "projections": [field_column(*f) for f in fields]
            }
        mode_theme.theme_slicer(
            visual,
            header_text,
            is_text_slicer=visual["visual"]["visualType"] == "textSlicer",
            toggle=vid == mode_theme.MODE_SLICER_ID,
        )
        if vid == mode_theme.MODE_SLICER_ID:
            visual["position"]["y"] = 824
            visual["position"]["height"] = 116
        write_text(os.path.join(dst_page, "visuals", vid, "visual.json"), json.dumps(visual, indent=2))
        emitted.append(vid)

    matrix = load_template_visual(src_pages, MATRIX_ID)
    matrix["visual"]["query"]["queryState"] = {
        "Rows": {"projections": [
            field_column("IncomeStatementLayout", "section", "Section"),
            field_column("IncomeStatementLayout", "category", "Category"),
            field_column("IncomeStatementLayout", "line_item", "Line Item"),
        ]},
        "Columns": {"projections": [field_column("dim_calendar", "year", "Year")]},
        "Values": {"projections": [field_measure("_measures_kpi", "im_amount", "Amount")]},
    }
    mode_theme.theme_matrix(matrix, "Income Statement")
    write_text(os.path.join(dst_page, "visuals", MATRIX_ID, "visual.json"), json.dumps(matrix, indent=2))
    emitted.append(MATRIX_ID)

    page = json.loads(read_text(os.path.join(src_pages, "page.json")))
    page["name"] = PAGE_ID
    page["displayName"] = "Income Statement"
    page.pop("filterConfig", None)
    page.pop("visibility", None)
    page.pop("visualInteractions", None)
    write_text(os.path.join(dst_page, "page.json"), json.dumps(page, indent=2))

    write_text(os.path.join(DEST_RPT, "definition", "pages", "pages.json"), json.dumps({
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json",
        "pageOrder": [PAGE_ID],
        "activePageName": PAGE_ID,
    }, indent=2))

    rpt = json.loads(read_text(os.path.join(TEMPLATE_RPT, "definition", "report.json")))
    rpt.pop("filterConfig", None)
    rpt["publicCustomVisuals"] = ["htmlContent443BE3AD55E043BF878BED274D3A6865"]
    write_text(os.path.join(DEST_RPT, "definition", "report.json"), json.dumps(rpt, indent=2))
    return emitted


def main():
    kept = build_semantic_model()
    emitted = build_report()
    model_tables = set(TEMPLATE_TABLES) | set(MEASURE_TABLES) | set(COFFEE_TABLES)
    audit_entities(DEST_RPT, model_tables)
    print("entity audit: clean")
    for table, names in kept.items():
        print(table + ": " + str(len(names)) + " template measures kept")
    print("layout rows: " + str(len(layout_rows())))
    print("visuals emitted: " + str(len(emitted)))


if __name__ == "__main__":
    main()
