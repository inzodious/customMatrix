import numpy as np
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RNG = np.random.default_rng(42)

N_MONTHS = 36
START_MONTH = pd.Timestamp("2023-01-01")

LOCATIONS = [
    {"location_id": "L01", "location_name": "Harborlight Coffee - Back Bay",       "city": "Boston",       "state": "MA", "region": "New England",  "market_tier": "Flagship", "seating_capacity": 42, "drive_thru": False, "sq_ft": 2100, "open_date": "2016-03-14"},
    {"location_id": "L02", "location_name": "Harborlight Coffee - Harvard Square", "city": "Cambridge",    "state": "MA", "region": "New England",  "market_tier": "Standard", "seating_capacity": 30, "drive_thru": False, "sq_ft": 1450, "open_date": "2017-09-01"},
    {"location_id": "L03", "location_name": "Harborlight Coffee - Providence Mile","city": "Providence",   "state": "RI", "region": "New England",  "market_tier": "Standard", "seating_capacity": 26, "drive_thru": False, "sq_ft": 1300, "open_date": "2018-05-20"},
    {"location_id": "L04", "location_name": "Harborlight Coffee - Old Port",       "city": "Portland",     "state": "ME", "region": "New England",  "market_tier": "Standard", "seating_capacity": 28, "drive_thru": False, "sq_ft": 1350, "open_date": "2019-06-11"},
    {"location_id": "L05", "location_name": "Harborlight Coffee - Market Square",  "city": "Portsmouth",   "state": "NH", "region": "New England",  "market_tier": "Kiosk",    "seating_capacity": 12, "drive_thru": False, "sq_ft": 650,  "open_date": "2020-02-03"},
    {"location_id": "L06", "location_name": "Harborlight Coffee - Church Street",  "city": "Burlington",   "state": "VT", "region": "New England",  "market_tier": "Standard", "seating_capacity": 24, "drive_thru": False, "sq_ft": 1200, "open_date": "2019-11-18"},
    {"location_id": "L07", "location_name": "Harborlight Coffee - Asylum Hill",    "city": "Hartford",     "state": "CT", "region": "New England",  "market_tier": "Standard", "seating_capacity": 32, "drive_thru": True,  "sq_ft": 1700, "open_date": "2017-04-09"},
    {"location_id": "L08", "location_name": "Harborlight Coffee - East Rock",      "city": "New Haven",    "state": "CT", "region": "New England",  "market_tier": "Standard", "seating_capacity": 28, "drive_thru": False, "sq_ft": 1400, "open_date": "2018-10-02"},
    {"location_id": "L09", "location_name": "Harborlight Coffee - Chelsea",        "city": "Manhattan",    "state": "NY", "region": "Mid-Atlantic", "market_tier": "Flagship", "seating_capacity": 48, "drive_thru": False, "sq_ft": 2400, "open_date": "2015-08-15"},
    {"location_id": "L10", "location_name": "Harborlight Coffee - Williamsburg",   "city": "Brooklyn",     "state": "NY", "region": "Mid-Atlantic", "market_tier": "Standard", "seating_capacity": 34, "drive_thru": False, "sq_ft": 1650, "open_date": "2016-11-30"},
    {"location_id": "L11", "location_name": "Harborlight Coffee - Lark Street",    "city": "Albany",       "state": "NY", "region": "Mid-Atlantic", "market_tier": "Standard", "seating_capacity": 26, "drive_thru": False, "sq_ft": 1250, "open_date": "2019-03-22"},
    {"location_id": "L12", "location_name": "Harborlight Coffee - Ironbound",      "city": "Newark",       "state": "NJ", "region": "Mid-Atlantic", "market_tier": "Standard", "seating_capacity": 30, "drive_thru": True,  "sq_ft": 1500, "open_date": "2018-01-08"},
    {"location_id": "L13", "location_name": "Harborlight Coffee - Nassau Street",  "city": "Princeton",    "state": "NJ", "region": "Mid-Atlantic", "market_tier": "Kiosk",    "seating_capacity": 14, "drive_thru": False, "sq_ft": 700,  "open_date": "2021-01-25"},
    {"location_id": "L14", "location_name": "Harborlight Coffee - Rittenhouse",    "city": "Philadelphia", "state": "PA", "region": "Mid-Atlantic", "market_tier": "Flagship", "seating_capacity": 40, "drive_thru": False, "sq_ft": 2000, "open_date": "2016-06-06"},
    {"location_id": "L15", "location_name": "Harborlight Coffee - Strip District", "city": "Pittsburgh",   "state": "PA", "region": "Mid-Atlantic", "market_tier": "Standard", "seating_capacity": 30, "drive_thru": True,  "sq_ft": 1550, "open_date": "2019-09-14"},
]

TIER_SCALE = {"Flagship": 1.55, "Standard": 1.0, "Kiosk": 0.55}

REVENUE_ITEMS = [
    ("rev_drip_coffee",         "Beverage Sales", 14500),
    ("rev_espresso_drinks",     "Beverage Sales", 21000),
    ("rev_cold_brew",           "Beverage Sales", 9800),
    ("rev_specialty_seasonal",  "Beverage Sales", 6200),
    ("rev_tea",                 "Beverage Sales", 3400),
    ("rev_pastries",            "Food Sales",      7600),
    ("rev_sandwiches",          "Food Sales",      6900),
    ("rev_breakfast",           "Food Sales",      4100),
    ("rev_snacks",              "Food Sales",      2300),
    ("rev_whole_bean",          "Retail Sales",    3100),
    ("rev_brew_equipment",      "Retail Sales",    1400),
    ("rev_merchandise",         "Retail Sales",    900),
    ("rev_gift_cards",          "Retail Sales",    1600),
    ("rev_catering",            "Other Income",    2200),
    ("rev_wholesale",           "Other Income",    1800),
]

EXPENSE_ITEMS = [
    ("exp_coffee_beans",        "Cost of Goods Sold", 9200),
    ("exp_dairy",               "Cost of Goods Sold", 5400),
    ("exp_syrups",              "Cost of Goods Sold", 1900),
    ("exp_food_ingredients",    "Cost of Goods Sold", 4300),
    ("exp_packaging",           "Cost of Goods Sold", 2100),
    ("exp_retail_cogs",         "Cost of Goods Sold", 1500),
    ("exp_barista_wages",       "Labor",              15800),
    ("exp_shift_lead_wages",    "Labor",              4900),
    ("exp_store_manager_salary","Labor",              5800),
    ("exp_payroll_taxes",       "Labor",              2600),
    ("exp_employee_benefits",   "Labor",              2100),
    ("exp_overtime",            "Labor",              1200),
    ("exp_rent",                "Occupancy",          7800),
    ("exp_utilities",           "Occupancy",          1600),
    ("exp_property_insurance",  "Occupancy",          650),
    ("exp_cam",                 "Occupancy",          900),
    ("exp_property_tax",        "Occupancy",          1100),
    ("exp_marketing",           "Operating Expenses", 1800),
    ("exp_pos_software",        "Operating Expenses", 620),
    ("exp_equipment_maintenance","Operating Expenses",950),
    ("exp_cleaning",            "Operating Expenses", 700),
    ("exp_cc_fees",             "Operating Expenses", 1650),
    ("exp_office_supplies",     "Operating Expenses", 340),
    ("exp_waste_removal",       "Operating Expenses", 410),
    ("exp_corporate_overhead",  "General & Administrative", 2400),
    ("exp_training",            "General & Administrative", 520),
    ("exp_general_liability_ins","General & Administrative",480),
    ("exp_bank_fees",           "General & Administrative", 210),
    ("exp_depreciation",        "General & Administrative", 1350),
    ("exp_professional_fees",   "General & Administrative", 640),
]

MONTH_SEASONALITY = {1: 0.90, 2: 0.88, 3: 0.95, 4: 1.00, 5: 1.05, 6: 1.12, 7: 1.15, 8: 1.10, 9: 1.02, 10: 1.00, 11: 1.08, 12: 1.22}
SUMMER_MONTHS = {6, 7, 8}
WINTER_MONTHS = {11, 12, 1, 2}


def month_ends(n_months, start):
    return [(start + pd.DateOffset(months=i) + pd.offsets.MonthEnd(0)) for i in range(n_months)]


def build_locations_df():
    return pd.DataFrame(LOCATIONS)[
        ["location_id", "location_name", "city", "state", "region", "market_tier",
         "seating_capacity", "drive_thru", "sq_ft", "open_date"]
    ]


def build_fact_rows(months):
    rows = []
    for loc in LOCATIONS:
        loc_id = loc["location_id"]
        scale = TIER_SCALE[loc["market_tier"]] * RNG.uniform(0.85, 1.15)
        for month_index, month_end in enumerate(months):
            month = month_end.month
            year_growth = 1.0 + 0.025 * (month_end.year - 2023)
            seasonal = MONTH_SEASONALITY[month]

            for key, category, base in REVENUE_ITEMS:
                item_seasonal = seasonal
                if key == "rev_cold_brew" and month in SUMMER_MONTHS:
                    item_seasonal *= 1.35
                if key == "rev_specialty_seasonal" and month in WINTER_MONTHS:
                    item_seasonal *= 1.45
                noise = RNG.normal(1.0, 0.08)
                amount = base * scale * item_seasonal * year_growth * noise
                rows.append((loc_id, month_end.date().isoformat(), key, round(max(amount, 0), 2)))

            revenue_index = scale * seasonal * year_growth
            for key, category, base in EXPENSE_ITEMS:
                if category == "Cost of Goods Sold":
                    driver = revenue_index * RNG.normal(1.0, 0.05)
                elif category == "Labor":
                    driver = (0.55 + 0.45 * revenue_index) * RNG.normal(1.0, 0.06)
                elif category == "Occupancy":
                    driver = RNG.normal(1.0, 0.02)
                else:
                    driver = RNG.normal(1.0, 0.10)
                amount = base * scale * driver
                rows.append((loc_id, month_end.date().isoformat(), key, -round(max(amount, 0), 2)))

    return pd.DataFrame(rows, columns=["location_id", "month_end", "line_item_key", "amount"])


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    months = month_ends(N_MONTHS, START_MONTH)

    locations_df = build_locations_df()
    fact_df = build_fact_rows(months)

    locations_path = DATA_DIR / "dim_locations.csv"
    fact_path = DATA_DIR / "fact_income_statement.csv"

    locations_df.to_csv(locations_path, index=False)
    fact_df.to_csv(fact_path, index=False)

    print(f"dim_locations.csv: {len(locations_df)} rows -> {locations_path}")
    print(f"fact_income_statement.csv: {len(fact_df)} rows -> {fact_path}")


if __name__ == "__main__":
    main()
