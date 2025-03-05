// landingPage2.ts
export const landingPage2HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Matrix</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #13141a;
            color: #ffffff;
            height: 100vh;
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        
        /* Star background */
        body:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 0;
            opacity: 0.3;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            position: relative;
            z-index: 1;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            position: absolute;
            top: 30px;
            padding: 0 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
        }
        
        .menu-button {
            border: none;
            background: transparent;
            color: #ffffff;
            cursor: pointer;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .orb-container {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: 40px;
        }
        
        .orb {
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, #ffffff 0%, #e0e0e0 70%, #b0b0b0 100%);
            border-radius: 50%;
            margin: 15px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
        
        .orb-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 180px;
            height: 180px;
            border: 2px solid #2a2a36;
            border-radius: 50%;
            box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
        }
        
        .main-title {
            font-size: 42px;
            font-weight: bold;
            letter-spacing: 10px;
            text-align: center;
            margin-bottom: 20px;
            color: #ffffff;
            text-transform: uppercase;
        }
        
        .main-title span {
            display: inline-block;
            margin: 0 5px;
        }
        
        .subtitle {
            font-size: 14px;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: 40px;
            color: #b0b0b0;
            text-transform: uppercase;
        }
        
        .feature-list {
            text-align: center;
            margin-bottom: 30px;
            max-width: 600px;
        }
        
        .feature-list ul {
            list-style: none;
            margin-top: 15px;
        }
        
        .feature-list li {
            margin-bottom: 10px;
            font-size: 14px;
            color: #d0d0d0;
        }
        
        .nav-buttons {
            display: flex;
            gap: 30px;
            margin-top: 20px;
        }
        
        .nav-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #ffffff;
            cursor: pointer;
        }
        
        .diamond {
            width: 40px;
            height: 40px;
            background-color: transparent;
            border: 2px solid rgba(255, 255, 255, 0.5);
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .diamond-inner {
            width: 10px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .continue-text {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .footer {
            position: absolute;
            bottom: 20px;
            width: 100%;
            text-align: center;
        }
        
        .progress {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .progress-item {
            width: 12px;
            height: 12px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
        }
        
        .progress-item.active {
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .credit {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon"></div>
                <div>NOVA MATRIX</div>
            </div>
        </div>
        
        <div class="orb-container">
            <div class="orb"></div>
            <div class="orb-ring"></div>
        </div>
        
        <h1 class="main-title">
            <span>F</span>
            <span>E</span>
            <span>A</span>
            <span>T</span>
            <span>U</span>
            <span>R</span>
            <span>E</span>
            <span>S</span>
        </h1>
        
        <div class="feature-list">
            <p class="subtitle">Nova Matrix offers powerful features for your data</p>
            <ul>
                <li>✨ Highly customizable styling and formatting</li>
                <li>✨ Interactive expand/collapse functionality</li>
                <li>✨ Advanced subtotal calculations</li>
                <li>✨ Dynamic row and column sizing</li>
                <li>✨ Smart context menu for quick actions</li>
            </ul>
        </div>
        
        <div class="nav-buttons">
            <a href="#" class="nav-button" data-action="back">
                <div class="diamond">
                    <div class="diamond-inner"></div>
                </div>
                <span class="continue-text">Back</span>
            </a>
            <a href="#" class="nav-button" data-action="next">
                <div class="diamond">
                    <div class="diamond-inner"></div>
                </div>
                <span class="continue-text">Next</span>
            </a>
        </div>
        
        <div class="footer">
            <div class="progress">
                <div class="progress-item"></div>
                <div class="progress-item active"></div>
                <div class="progress-item"></div>
            </div>
            <div class="credit">Developed by Joshua Biondo</div>
        </div>
    </div>
</body>
</html>`;