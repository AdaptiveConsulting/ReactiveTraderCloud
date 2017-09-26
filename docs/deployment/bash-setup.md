# You want to: Setup Bash

- [You want to: Setup Bash](#you-want-to-setup-bash)
    - [Linux](#linux)
    - [Windows](#windows)
    - [Mac](#mac)

## Linux
Nothing to do, just open a terminal

## Windows
- install [git with bash][bash-install]
- [optional] ConEMU
    - Install [ConEMU][conemu-install]. Stable version should be perfect.
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
## Mac
TO BE DONE BY A MAC USER

[bash-install]: https://git-scm.com/download/win
[conemu-install]: https://www.fosshub.com/ConEmu.html
