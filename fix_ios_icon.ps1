Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\marsi\.gemini\antigravity\brain\8a946c9e-3748-4dcc-b628-a20f067190dd\media__1781796128054.png"
$img = [System.Drawing.Image]::FromFile($imagePath)

$newSize = New-Object System.Drawing.Size(1024, 1024)
$bmp = New-Object System.Drawing.Bitmap($newSize.Width, $newSize.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)

# Create a solid brush with the theme color #F05528
$color = [System.Drawing.ColorTranslator]::FromHtml("#F05528")
$brush = New-Object System.Drawing.SolidBrush($color)

# Fill the entire background with the solid color
$g.FillRectangle($brush, 0, 0, $newSize.Width, $newSize.Height)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Draw the transparent image on top
$g.DrawImage($img, 0, 0, $newSize.Width, $newSize.Height)

$bmp.Save("d:\cepfinans\assets\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$brush.Dispose()
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output "Solid background image created."
