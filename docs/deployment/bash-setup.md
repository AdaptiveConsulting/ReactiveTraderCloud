# You want to: Setup Bash
## linux
Nothing to do, just open a terminal

## windows
- install [git with bash](https://git-scm.com/download/win)
- [optional] ConEMU
    - Install [ConEMU](https://www.fosshub.com/ConEmu.html). Stable version should be perfect.
    - Start ConEMU
    - Start bash
        - **[Solution 1]**:
            - On the upper right, close to the green vertical cross, click on the down arrow
        - **[Solution 2]**:
            - Open your powershell profile and add this:
                ```powershell
                function bash {
                    Invoke-Expression "& ""C:\Program Files\Git\git-cmd.exe"" --no-cd --command=usr/bin/bash.exe -l -i"
                }
                ```
            - in powershell run
                ```powershell
                bash
                ```
## mac
TODO
