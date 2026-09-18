import uuid

NAMESPACE = uuid.UUID("6f1c1a3e-2b44-4f6e-9a1d-7c5b8e0d4a21")

MEASURE_HOME = "_measures_format"
MODE_SLICER_ID = "4cbec43bd8983e0042ef"
BACKDROP_ID = "0a7f3c19d64b2e58f0a1"

TOKENS = [
    ("page_background", "#F5EEE3", "#241C17"),
    ("rail_background", "#EFE7DA", "#2A2019"),
    ("visual_background", "#FFFBF4", "#2F241D"),
    ("border_color", "#DCC9AE", "#4A3A2E"),
    ("text_color", "#3B2A20", "#F0E6DA"),
    ("text_muted", "#7A6553", "#BCA792"),
    ("header_background", "#4E342E", "#4A382C"),
    ("header_text", "#F7F1E8", "#F7EFE4"),
    ("row_header_background", "#EFE2D0", "#3A2C23"),
    ("row_header_text", "#3B2A20", "#F0E6DA"),
    ("value_text", "#3B2A20", "#F0E6DA"),
    ("subtotal_background", "#E4D5BE", "#45352A"),
    ("subtotal_text", "#2E1F17", "#FFF6EA"),
    ("grid_line_color", "#DCC9AE", "#4A3A2E"),
    ("accent_color", "#B5703A", "#E0A96D"),
    ("button_background", "#4E342E", "#C08A3E"),
    ("button_text", "#F7F1E8", "#241C17"),
    ("positive_color", "#3F6B4A", "#8FBF9A"),
    ("negative_color", "#9B3521", "#F0907A"),
]

MODES = [("Light", 1, 1), ("Dark", 2, 2)]

CHROME_TEXT = "#F7F1E8"

TOGGLE_BACKGROUND = "#4E342E"
TOGGLE_TEXT = "#F7F1E8"
TOGGLE_ITEM_BACKGROUND = "#6F4E37"
LABEL_ACCENT = "#C08A3E"
LABEL_TEXT = "#9A7B5F"


def tag(name):
    return str(uuid.uuid5(NAMESPACE, name))


def light_value(token):
    return dict((t[0], t[1]) for t in TOKENS)[token]


def string_column(name):
    return '''	column %s
		dataType: string
		isHidden
		lineageTag: %s
		summarizeBy: none
		isNameInferred
		sourceColumn: [%s]

		annotation SummarizationSetBy = Automatic
''' % (name, tag("dim_mode." + name), name)


def build_dim_mode_tmdl():
    columns = ['''	column mode
		dataType: string
		lineageTag: %s
		summarizeBy: none
		isNameInferred
		sourceColumn: [mode]
		sortByColumn: mode_order

		changedProperty = SortByColumn

		annotation SummarizationSetBy = Automatic
''' % tag("dim_mode.mode"), '''	column mode_order
		dataType: int64
		isHidden
		formatString: 0
		lineageTag: %s
		summarizeBy: sum
		isNameInferred
		sourceColumn: [mode_order]

		annotation SummarizationSetBy = Automatic
''' % tag("dim_mode.mode_order")]

    columns.extend(string_column(t[0]) for t in TOKENS)

    decls = ['\t\t\t\t    "mode", STRING', '\t\t\t\t    "mode_order", INTEGER']
    decls.extend('\t\t\t\t    "%s", STRING' % t[0] for t in TOKENS)

    rows = []
    for name, order, idx in MODES:
        values = ['"%s"' % name, str(order)]
        values.extend('"%s"' % t[idx] for t in TOKENS)
        rows.append("\t\t\t\t    { " + ", ".join(values) + " }")

    return '''table dim_mode
	lineageTag: %s

%s
	partition dim_mode = calculated
		mode: import
		source = ```
				DATATABLE (
%s,
				    {
%s
				    }
				)
				```

	annotation PBI_ResultType = Table
''' % (tag("dim_mode"), "\n".join(columns), ",\n".join(decls), ",\n".join(rows))


def mode_measures_tmdl():
    blocks = ['''	measure fmt_mode = SELECTEDVALUE ( dim_mode[mode], "Light" )
		lineageTag: %s''' % tag("measure.fmt_mode")]

    for name, light, _dark in TOKENS:
        blocks.append('''	measure fmt_mode_%s = SELECTEDVALUE ( dim_mode[%s], "%s" )
		lineageTag: %s''' % (name, name, light, tag("measure.fmt_mode_" + name)))

    return "\n\n".join(blocks)


def measure_color(token):
    return {"solid": {"color": {"expr": {"Measure": {
        "Expression": {"SourceRef": {"Entity": MEASURE_HOME}},
        "Property": "fmt_mode_" + token,
    }}}}}


def static_color(value):
    return {"solid": {"color": {"expr": {"Literal": {"Value": "'%s'" % value}}}}}


def literal(value):
    return {"expr": {"Literal": {"Value": value}}}


def quoted(value):
    return {"expr": {"Literal": {"Value": "'%s'" % value}}}


def set_title(visual, text, token="text_color"):
    container = visual["visual"].setdefault("visualContainerObjects", {})
    container["title"] = [{"properties": {
        "show": literal("true"),
        "text": quoted(text),
        "fontColor": measure_color(token),
        "background": measure_color("visual_background"),
    }}]
    return visual


def theme_matrix(matrix, title):
    objects = matrix["visual"].setdefault("objects", {})

    objects["columnHeaders"] = [{"properties": {
        "backColor": measure_color("header_background"),
        "fontColor": measure_color("header_text"),
        "outlineColor": measure_color("grid_line_color"),
        "autoSizeColumnWidth": literal("false"),
    }}]
    objects["rowHeaders"] = [{"properties": {
        "backColor": measure_color("row_header_background"),
        "fontColor": measure_color("row_header_text"),
        "outlineColor": measure_color("grid_line_color"),
        "steppedLayout": literal("true"),
    }}]
    objects["values"] = [{"properties": {
        "backColorPrimary": measure_color("visual_background"),
        "backColorSecondary": measure_color("visual_background"),
        "fontColorPrimary": measure_color("value_text"),
        "fontColorSecondary": measure_color("value_text"),
        "outlineColor": measure_color("grid_line_color"),
        "outlineStyle": literal("0D"),
    }}]
    objects["subTotals"] = [{"properties": {
        "rowSubtotals": literal("true"),
        "columnSubtotals": literal("true"),
        "backColor": measure_color("subtotal_background"),
        "fontColor": measure_color("subtotal_text"),
    }}]
    objects["grid"] = [{"properties": {
        "gridVertical": literal("true"),
        "gridHorizontal": literal("true"),
        "gridVerticalColor": measure_color("grid_line_color"),
        "gridHorizontalColor": measure_color("grid_line_color"),
        "outlineColor": measure_color("grid_line_color"),
        "outlineStyle": literal("0D"),
    }}]

    container = matrix["visual"].setdefault("visualContainerObjects", {})
    container["background"] = [{"properties": {
        "show": literal("true"),
        "color": measure_color("visual_background"),
    }}]
    container["border"] = [{"properties": {
        "show": literal("true"),
        "color": measure_color("border_color"),
    }}]
    container.pop("divider", None)
    set_title(matrix, title)
    return matrix


def theme_slicer(visual, header_text, is_text_slicer=False, toggle=False):
    objects = visual["visual"].setdefault("objects", {})

    if is_text_slicer:
        box = objects.setdefault("inputTextBox", [{"properties": {}}])
        box[0].setdefault("properties", {})["fontColor"] = measure_color("text_color")
        box[0]["properties"]["background"] = measure_color("visual_background")
        set_title(visual, header_text)
        return visual

    container = visual["visual"].setdefault("visualContainerObjects", {})
    container.pop("divider", None)

    if toggle:
        objects["header"] = [{"properties": {
            "show": literal("true"),
            "text": quoted(header_text),
            "background": static_color(TOGGLE_BACKGROUND),
            "fontColor": static_color(TOGGLE_TEXT),
            "fontFamily": quoted("'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif"),
            "textSize": literal("10D"),
            "outline": literal("'None'"),
        }}]
        objects["items"] = [{"properties": {
            "fontColor": static_color(TOGGLE_TEXT),
            "background": static_color(TOGGLE_ITEM_BACKGROUND),
            "textSize": literal("10D"),
            "outlineStyle": literal("0D"),
        }}]
        objects["data"] = [{"properties": {"mode": quoted("Basic")}}]
        objects["selection"] = [{"properties": {
            "selectAllCheckboxEnabled": literal("false"),
            "singleSelect": literal("true"),
            "strictSingleSelect": literal("true"),
        }}]
        container["background"] = [{"properties": {
            "show": literal("true"),
            "color": static_color(TOGGLE_BACKGROUND),
        }}]
        container["border"] = [{"properties": {
            "show": literal("true"),
            "color": static_color(LABEL_ACCENT),
        }}]
        return visual

    objects["header"] = [{"properties": {
        "show": literal("true"),
        "text": quoted(header_text),
        "background": measure_color("rail_background"),
        "fontColor": measure_color("text_color"),
        "fontFamily": quoted("'Segoe UI Semibold', wf_segoe-ui_semibold, helvetica, arial, sans-serif"),
        "textSize": literal("10D"),
        "outline": literal("'None'"),
    }}]
    objects["items"] = [{"properties": {
        "fontColor": measure_color("text_color"),
        "background": measure_color("visual_background"),
        "textSize": literal("10D"),
        "outlineStyle": literal("0D"),
    }}]

    container["background"] = [{"properties": {
        "show": literal("true"),
        "color": measure_color("rail_background"),
    }}]
    return visual


def selector_entry(entries, selector_id):
    for entry in entries:
        if entry.get("selector", {}).get("id") == selector_id:
            return entry.setdefault("properties", {})
    entry = {"properties": {}, "selector": {"id": selector_id}}
    entries.append(entry)
    return entry["properties"]


def theme_page_navigator(visual, token):
    objects = visual["visual"].setdefault("objects", {})

    text = objects.setdefault("text", [])
    selector_entry(text, "default")["fontColor"] = measure_color("text_muted")
    selector_entry(text, "selected")["fontColor"] = measure_color("header_text")

    fill = objects.setdefault("fill", [])
    selector_entry(fill, "default")["transparency"] = literal("100D")
    selected_fill = selector_entry(fill, "selected")
    selected_fill["fillColor"] = measure_color("header_background")
    selected_fill["transparency"] = literal("0D")

    outline = objects.setdefault("outline", [])
    selector_entry(outline, "default")["transparency"] = literal("100D")
    selected_outline = selector_entry(outline, "selected")
    selected_outline["lineColor"] = measure_color("accent_color")
    selected_outline["transparency"] = literal("0D")

    container = visual["visual"].setdefault("visualContainerObjects", {})
    container.pop("dropShadow", None)
    container["border"] = [{"properties": {"show": literal("false")}}]
    container["background"] = [{"properties": {
        "show": literal("true"),
        "color": measure_color(token),
    }}]
    return visual


def theme_button(visual):
    objects = visual["visual"].setdefault("objects", {})

    fill = objects.setdefault("fill", [])
    del fill[:]
    fill.append({"properties": {"show": literal("true")}})
    default_fill = selector_entry(fill, "default")
    default_fill["fillColor"] = measure_color("button_background")
    default_fill["transparency"] = literal("0D")

    selector_entry(objects.setdefault("text", []), "default")["fontColor"] = measure_color("button_text")
    selector_entry(objects.setdefault("icon", []), "default")["lineColor"] = measure_color("button_text")

    container = visual["visual"].setdefault("visualContainerObjects", {})
    container["background"] = [{"properties": {"show": literal("false")}}]
    container["border"] = [{"properties": {"show": literal("false")}}]
    container["dropShadow"] = [{"properties": {"show": literal("false")}}]
    return visual


def theme_label(visual):
    runs = visual["visual"]["objects"]["general"][0]["properties"]["paragraphs"][0]["textRuns"]
    for index, run in enumerate(runs):
        run.setdefault("textStyle", {})["color"] = LABEL_ACCENT if index == 0 else LABEL_TEXT
    return visual


def theme_shape(visual, token):
    container = visual["visual"].setdefault("visualContainerObjects", {})
    container["background"] = [{"properties": {
        "show": literal("true"),
        "color": measure_color(token),
    }}]
    container.pop("border", None)
    container.pop("dropShadow", None)
    return visual


def theme_card(visual):
    objects = visual["visual"].setdefault("objects", {})
    for key in ("value", "label"):
        entries = objects.setdefault(key, [{"properties": {}}])
        entries[0].setdefault("properties", {})["fontColor"] = measure_color("header_text")
    container = visual["visual"].setdefault("visualContainerObjects", {})
    container["background"] = [{"properties": {
        "show": literal("true"),
        "color": measure_color("header_background"),
    }}]
    container.pop("border", None)
    return visual


def backdrop_visual():
    return {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.11.0/schema.json",
        "name": BACKDROP_ID,
        "position": {"x": 0, "y": 0, "z": 0, "height": 1080, "width": 1920, "tabOrder": 0},
        "visual": {
            "visualType": "shape",
            "objects": {
                "shape": [{"properties": {"tileShape": quoted("rectangle")}}],
                "fill": [{"properties": {"show": literal("false")}}],
                "outline": [{"properties": {"show": literal("false")}}],
            },
            "visualContainerObjects": {
                "background": [{"properties": {
                    "show": literal("true"),
                    "color": measure_color("page_background"),
                }}],
                "title": [{"properties": {"show": literal("false"), "text": quoted("BG_Page")}}],
            },
            "drillFilterOtherVisuals": True,
        },
    }


APPLIED_FILTER_COLORS = [
    ("#171C73", "_hdrBg"),
    ("#FDD44F", "_accent"),
    ("#FFFFFF", "_hdrText"),
    ("#e2e8f0", "_pillText"),
]

APPLIED_FILTER_VARS = '''			    VAR _hdrBg = [fmt_mode_header_background]
			    VAR _accent = [fmt_mode_accent_color]
			    VAR _hdrText = [fmt_mode_header_text]
			    VAR _pillText = [fmt_mode_header_text]
'''


def theme_applied_filters(text):
    anchor = "			    VAR vReportDate = [fmt_report_date] "
    if anchor not in text:
        raise ValueError("applied-filters anchor not found")
    text = text.replace(anchor, APPLIED_FILTER_VARS + anchor, 1)
    for value, var in APPLIED_FILTER_COLORS:
        text = text.replace(value, '" & %s & "' % var)
    if text.count('"') % 2 != 0:
        raise ValueError("applied-filters quote parity broken")
    return text
