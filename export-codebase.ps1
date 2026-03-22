$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$output = Join-Path (Get-Location) "codebase-export-$timestamp.zip"

Write-Host "Creating codebase export at: $output"

$excludeDirs = @(
    '\node_modules\',
    '\.git\',
    '\dist\',
    '\build\',
    '\.next\',
    '\coverage\',
    '\tmp\',
    '\.cache\'
)

$excludeFiles = @(
    '.DS_Store'
)

$files = Get-ChildItem -Path . -Recurse -Force -File | Where-Object {
    $full = $_.FullName

    if ($full -eq $output) { return $false }

    foreach ($dir in $excludeDirs) {
        if ($full -like "*$dir*") { return $false }
    }

    foreach ($name in $excludeFiles) {
        if ($_.Name -eq $name) { return $false }
    }

    if ($_.Extension -eq '.log') { return $false }

    return $true
}

if (-not $files -or $files.Count -eq 0) {
    Write-Error "No files found to archive."
    exit 1
}

Compress-Archive -Path $files.FullName -DestinationPath $output -Force

if (Test-Path $output) {
    Write-Host "Export complete: $output"
} else {
    Write-Error "Archive was not created."
    exit 1
}