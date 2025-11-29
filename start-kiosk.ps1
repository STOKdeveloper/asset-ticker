$url = "http://localhost:3000"

# Try Chrome
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

if (Test-Path $chromePath) {
    Start-Process $chromePath -ArgumentList "--kiosk $url"
    exit
}

# Try Edge
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (Test-Path $edgePath) {
    Start-Process $edgePath -ArgumentList "--kiosk $url --edge-kiosk-type=fullscreen"
    exit
}

Write-Host "Could not find Chrome or Edge."
