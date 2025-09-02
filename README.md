customMatrix - The Ultimate Custom Matrix for Power BI 🚀

customMatrix is a ground-up, custom-built matrix visual for Microsoft Power BI, designed to overcome the limitations of the native matrix. It offers unparalleled customization, smooth animations, and powerful dynamic coloring to bring your data to life in ways you never thought possible.
✨ Key Features

    Smooth Collapse/Expand Animations: Fluidly navigate your data hierarchies with satisfying, configurable animations that make data exploration intuitive and engaging.

    🎨 Advanced Dynamic Coloring: Go beyond standard conditional formatting. Apply gradients, color scales, and intricate rule-based coloring to any part of the matrix—headers, values, and totals.

    ✒️ Total Typographic Control: Independently customize font family, size, color, and style (bold, italic, underline) for headers, values, and totals.

    📏 Granular Layout & Spacing: Achieve a pixel-perfect design by adjusting cell padding, row height, header indentation, and border styles.

    📊 Customizable Totals & Subtotals: Make totals and subtotals stand out with unique styling, formatting, and labels.

    ⚡ Performance-Focused: Built from scratch with performance in mind, ensuring a smooth, responsive experience even with large, complex datasets.

    ** (Icons) for Hierarchy:** Choose from a selection of modern icons to represent the expand/collapse state of your rows.

📦 Installation & Usage
Installation

    Go to the Releases page of this repository.

    Download the latest .pbiviz file.

    Open your Power BI report in Power BI Desktop.

    Navigate to the Visualizations pane > Click the ... (ellipses) > Import a visual from a file.

    Select the downloaded .pbiviz file.

    Once imported, the customMatrix icon will appear in your Visualizations pane.

Basic Usage

    Click the customMatrix icon to add it to your report canvas.

    With the visual selected, drag your categorical fields into the Rows well.

    Drag your measures or numerical fields into the Values well.

    Explore the Format Visual pane to begin customizing!

🔧 Customization Options

customMatrix exposes a rich set of formatting options to give you complete control.

    Matrix Layout

        Row Padding: Control the vertical spacing within each row.

        Column Padding: Control the horizontal spacing within each column.

        Indentation: Set the pixel indentation for each level of the hierarchy.

        Borders: Customize the color, width, and style of inner and outer borders.
    Animations

        Enable Animations: A simple toggle to turn on/off the row collapse/expand animations.

        Animation Style: Choose from different animation styles (e.g., Fade, Slide).

        Duration: Control the speed of the animation in milliseconds.
    Headers & Values (Separate sections for Column Headers, Row Headers, and Values)

        Font: Set font family, size, color, and style (bold, italic, etc.).

        Background: Set the background color.

        Alignment: Align text horizontally (left, center, right) and vertically.

        Icons (Row Headers only): Select the icon set for expand/collapse actions.
    Dynamic Coloring

        Target Element: Apply formatting to Values, Row Headers, or Column Headers.

        Formatting Type:

            Color Scale: Applies a 2-point or 3-point color gradient based on the value.

            Rules: Create specific rules to apply formatting (e.g., if value > 100, then color is green).

            Value: Format based on the field's text value (e.g., if status is "Complete", then color is blue).

Build & Run

    Clone the repository:

    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO.git](https://github.com/YOUR_USERNAME/YOUR_REPO.git)
    cd YOUR_REPO

    Install dependencies:

    npm install

    Run the development server:

    pbiviz start

    This will compile the visual and host it locally. You can then use the "Developer Visual" in Power BI Service to test your changes in real-time.

    Package the visual for production:

    pbiviz package

    This will generate the .pbiviz file in the dist folder.

Contributions, issues, and feature requests are welcome!
📜 License

This project is licensed under the MIT License - see the LICENSE.md file for details.
