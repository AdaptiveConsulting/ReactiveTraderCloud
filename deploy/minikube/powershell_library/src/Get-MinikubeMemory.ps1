function Get-MinikubeMemory {
    if (Test-Path $shared_data.memory_configuration) {
        [Int] $memory = Get-Content $shared_data.memory_configuration
    }
    else {
        [Int] $default_amount = 4000
        while ($true) {
            try {
                [Int] $memory = Read-Host "Please provide the amount of memory you want for the minikube. $default_amount should be enough"
                break
            }
            catch {
                Write-Host -ForegroundColor "Red" "Please provide an integer ... Example $default_amount"
            }
        }
    
        [Hashtable] $shared_data = Get-SharedData
    
        $memory > $shared_data.memory_configuration
    }

    $memory
}
