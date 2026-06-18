Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\marsi\.gemini\antigravity\brain\8a946c9e-3748-4dcc-b628-a20f067190dd\media__1781794030162.png"
$img = [System.Drawing.Image]::FromFile($imagePath)
Write-Output "Original Size: $($img.Width) x $($img.Height)"
$img.Dispose()
