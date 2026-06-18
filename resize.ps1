Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\marsi\.gemini\antigravity\brain\8a946c9e-3748-4dcc-b628-a20f067190dd\media__1781794960593.png"
$img = [System.Drawing.Image]::FromFile($imagePath)

$newSize = New-Object System.Drawing.Size(1024, 1024)
$bmp = New-Object System.Drawing.Bitmap($newSize.Width, $newSize.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$ratio = [math]::Min(1024 / $img.Width, 1024 / $img.Height)
$newWidth = [int]($img.Width * $ratio)
$newHeight = [int]($img.Height * $ratio)

$x = [int]((1024 - $newWidth) / 2)
$y = [int]((1024 - $newHeight) / 2)

$g.DrawImage($img, $x, $y, $newWidth, $newHeight)

$bmp.Save("d:\cepfinans\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Image centered and saved to assets\icon.png"
