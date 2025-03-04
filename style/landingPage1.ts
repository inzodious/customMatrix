// landingPage1.ts
export const landingPageHTML = `<!DOCTYPE html>
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
            color: #ff7846;
        }
        
        .logo-icon {
            width: 20px;
            height: 20px;
            background-color: #ff7846;
            margin-right: 10px;
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
        
        .continue-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #ffffff;
            margin-top: 20px;
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
                <div>Nova Matrix Analytics</div>
            </div>
            <button class="menu-button">Options</button>
        </div>
        
        <div class="orb-container">
            <div class="orb"></div>
            <div class="orb-ring"></div>
        </div>
        
        <h1 class="main-title">
            <span>W</span>
            <span>E</span>
            <span>L</span>
            <span>C</span>
            <span>O</span>
            <span>M</span>
            <span>E</span>
            <span>&nbsp;</span>
            <span>T</span>
            <span>O</span>
            <span>&nbsp;</span>
            <span>T</span>
            <span>H</span>
            <span>E</span>
            <span>&nbsp;</span>
            <span>N</span>
            <span>O</span>
            <span>V</span>
            <span>A</span>
            <span>&nbsp;</span>
            <span>M</span>
            <span>A</span>
            <span>T</span>
            <span>R</span>
            <span>I</span>
            <span>X</span>
        </h1>
        
        <p class="subtitle">Data will not make decisions for you. You do it!</p>
        
        <a href="#" class="continue-button">
            <div class="diamond">
                <div class="diamond-inner"></div>
            </div>
            <span class="continue-text">Continue</span>
        </a>
        
        <div class="footer">
            <div class="progress">
                <div class="progress-item active"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
            </div>
            <div class="credit">Developed by Matrix Team</div>
        </div>
    </div>
</body>
</html>`;