---
title: "Shortcodes In Action"
date: "2021-02-14"
categories:
- Hugo
- Shortcodes
---

The theme's short codes in action. See my shortcode repository at
https://github.com/parsiya/Hugo-Shortcodes for more.

<!--more-->

# Codecaption

**Python**

{{< codecaption title="Python code highlight" lang="python" >}}
from base64 import b64encode
from binascii import unhexlify

print b64encode(unhexlify("0a0b0c0d"))
CgsMDQ==
{{< /codecaption >}}

**Go**

{{< codecaption title="Go highlight" lang="go" >}}
// zlib inflate (decompress).

package main

import (
	"compress/zlib"
	"io"
	"os"
)

func main() {
	zlibFile, err := os.Open("test.zlib")
	if err != nil {
		panic(err)
	}
	defer zlibFile.Close()

	r, err := zlib.NewReader(zlibFile)
	if err != nil {
		panic(err)
	}
	defer r.Close()

	outFile, err := os.Create("out-zlib")
	if err != nil {
		panic(err)
	}
	defer outFile.Close()

	io.Copy(outFile, r)
}
{{< /codecaption >}}


Python code highlight using the Hugo internal `highlight` shortcode:

{{< highlight python >}}
from base64 import b64encode
from binascii import unhexlify

print b64encode(unhexlify("0a0b0c0d"))
CgsMDQ==
{{</highlight >}}

**Test gist1**

{{< gist parsiya 3c18b044bda63d34bdb83eddb66bee4c >}}

**Test gist2**

{{< gist parsiya 423b289016de056671ed6af58e364b99 >}}

**Powershell**

{{< codecaption title="Hello" lang="posh" >}}
# notepad does not have an entry
$ Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\notepad.exe"
False
# chrome does
$ Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
True
{{< /codecaption >}}

**Indented code block**

    # notepad does not have an entry
    $ Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\notepad.exe"
    False
    # chrome does
    $ Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"
    True

# imgcap
{{< imgcap title="The national parks preserve wild life" src="01.jpg" >}}

Image is named `The national parks preserve wild life`. Acquired from the
Library of Congress' "Free to Use and Reuse: Work Projects Administration (WPA)
Posters" collection at https://www.loc.gov/item/98518597/.

The same image using the markdown image tag.

![](01.jpg)
