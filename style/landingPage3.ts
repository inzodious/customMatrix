// landingPage3.ts
export const landingPage3HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Matrix - Basic</title>
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
            overflow-y: auto;
            min-height: 500px;
            gap: clamp(15px, 2.5vh, 25px);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            position: absolute;
            top: 0;
            padding: 20px 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
        }
        
        .main-title {
            font-size: clamp(24px, 5vw, 36px);
            font-weight: bold;
            letter-spacing: clamp(4px, 1vw, 8px);
            text-align: center;
            margin-bottom: clamp(5px, 1.5vh, 10px);
            color: #ffffff;
            text-transform: uppercase;
        }
        
        .subtitle {
            font-size: 14px;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: clamp(15px, 2vh, 30px);
            color: #b0b0b0;
            text-transform: uppercase;
        }
        
        .feature-list {
            text-align: center;
            max-width: 600px;
            padding: 0 10px;
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
            gap: clamp(15px, 4vw, 30px);
            margin-top: clamp(10px, 2vh, 20px);
        }
        
        .nav-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #ffffff;
            cursor: pointer;
        }
        
        /* Button orbs */
        .button-orb-container {
            width: 50px;
            height: 50px;
            position: relative;
            margin-bottom: 10px;
        }
        
        .button-orb {
            width: 30px;
            height: 30px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.9) 15%, 
                rgba(255, 234, 130, 0.8) 30%, 
                rgba(255, 183, 101, 0.7) 45%, 
                rgba(255, 100, 80, 0.5) 60%,
                transparent 75%);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 
                0 0 15px rgba(255, 234, 130, 0.4),
                0 0 25px rgba(255, 183, 101, 0.2);
            animation: buttonPulse 2s infinite alternate, rotate 15s infinite linear;
            opacity: 0.9;
        }
        
        .button-orb:before {
            content: '';
            position: absolute;
            top: -15%;
            left: -15%;
            right: -15%;
            bottom: -15%;
            border-radius: 50%;
            background: radial-gradient(circle, 
                transparent 60%, 
                rgba(255, 234, 130, 0.1) 70%, 
                rgba(255, 183, 101, 0.1) 80%, 
                transparent 100%);
            z-index: -1;
            animation: buttonGlow 3s infinite alternate;
        }
        
        .button-orb:after {
            content: '';
            position: absolute;
            width: 40%;
            height: 40%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(255, 240, 180, 0.8) 50%, 
                transparent 100%);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 240, 180, 0.5);
            animation: buttonCoreGlow 1.5s infinite alternate;
        }
        
        @keyframes buttonPulse {
            0% {
                transform: translate(-50%, -50%) scale(0.9);
            }
            100% {
                transform: translate(-50%, -50%) scale(1.1);
            }
        }
        
        @keyframes buttonGlow {
            0% {
                opacity: 0.3;
                box-shadow: 0 0 15px rgba(255, 234, 130, 0.2);
            }
            100% {
                opacity: 0.6;
                box-shadow: 0 0 25px rgba(255, 183, 101, 0.4);
            }
        }
        
        @keyframes buttonCoreGlow {
            0% {
                opacity: 0.7;
                width: 36%;
                height: 36%;
            }
            100% {
                opacity: 1;
                width: 43%;
                height: 43%;
            }
        }
        
        @keyframes rotate {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 100% 100%;
            }
        }
        
        .continue-text {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .footer {
            width: 100%;
            text-align: center;
            margin-top: clamp(10px, 2vh, 20px);
            position: relative;
        }
        
        .progress {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
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
        
        /* Content wrapper to maintain consistent vertical centering */
        .content-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 100%;
            padding-top: 60px; /* Fixed space for header */
        }
        
        /* Smoother responsive approach with no sudden jumps */
        @media (max-width: 768px) {
            .nav-buttons {
                gap: calc(15px + (30 - 15) * ((100vw - 320px) / (768 - 320)));
            }
            
            .progress {
                gap: calc(10px + (15 - 10) * ((100vw - 320px) / (768 - 320)));
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div>NOVA MATRIX</div>
            </div>
            <div class="progress">
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item active"></div>
            </div>
        </div>
        
        <div class="content-wrapper">
            <h1 class="main-title">INSTRUCTIONS</h1>
            
            <div class="feature-list">
                <p class="subtitle">Begin presenting your data to viewers by:</p>
                <ul>
                    <li>✨ Adding a Matrix visual to your report</li>
                    <li>✨ Configure the Rows, Columns, and Values fields</li>
                    <li>✨ Use the formatting panel to customize your matrix</li>
                    <li>✨ Enjoy the power of interactive data exploration!</li>
                </ul>
            </div>
            
            <div class="nav-buttons">
                <a href="#" class="nav-button">
                    <div class="button-orb-container">
                        <div class="button-orb"></div>
                    </div>
                    <span class="continue-text">Back</span>
                </a>
            </div>
            
            <div class="footer">
                <div class="credit">Developed by Joshua Biondo</div>
            </div>
        </div>
    </div>
</body>
</html>`;