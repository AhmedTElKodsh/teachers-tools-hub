$content = Get-Content "data\tools.json" -Raw
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\data\tools.json", $content, $utf8NoBom)
