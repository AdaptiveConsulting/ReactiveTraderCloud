$src = $(Get-ChildItem -Path "$PSScriptRoot\src\*.ps1" -ErrorAction SilentlyContinue | Where-Object {$_.Name -NotMatch "\.Tests\.ps1"})
foreach($import in $src) {
    try {
        . $import.fullname
    }
    catch {
        Write-Error -Message "Failed to import function $($import.fullname): $_"
    }
}
