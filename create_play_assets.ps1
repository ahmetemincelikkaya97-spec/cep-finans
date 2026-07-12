Add-Type -AssemblyName System.Drawing

$srcFile = 'd:\cepfinans\tadora_logo_1778842526367.png'
$srcImg = [System.Drawing.Image]::FromFile($srcFile)

# Create 512x512 icon
$iconBmp = New-Object System.Drawing.Bitmap(512, 512)
$iconG = [System.Drawing.Graphics]::FromImage($iconBmp)
$iconG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$iconG.DrawImage($srcImg, 0, 0, 512, 512)
$iconBmp.Save('d:\cepfinans\play_store_icon_512x512.png', [System.Drawing.Imaging.ImageFormat]::Png)
$iconG.Dispose()
$iconBmp.Dispose()

# Create 1024x500 feature graphic
$featBmp = New-Object System.Drawing.Bitmap(1024, 500)
$featG = [System.Drawing.Graphics]::FromImage($featBmp)
$featG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 26, 26, 26))
$featG.FillRectangle($bgBrush, 0, 0, 1024, 500)

$logoSize = 400
$x = (1024 - $logoSize) / 2
$y = (500 - $logoSize) / 2
$featG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$featG.DrawImage($srcImg, $x, $y, $logoSize, $logoSize)

$featBmp.Save('d:\cepfinans\play_store_feature_1024x500.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bgBrush.Dispose()
$featG.Dispose()
$featBmp.Dispose()
$srcImg.Dispose()
Write-Output 'Assets created successfully!'
