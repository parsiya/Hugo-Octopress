+++
title = "Bidirectional Text"
date = 2026-10-25T12:00:00Z
tags = ["Mixed tag"]
categories = ["Research"]
+++
Text with {{< bidi dir="ltr" lang="en" >}}**C++ (v1.2)**{{< /bidi >}} and punctuation.

<!--more-->

{{< direction dir="ltr" lang="en" >}}
First **Markdown** paragraph.

Second paragraph with {{< bidi dir="rtl" lang="he" >}}שלום!{{< /bidi >}}, then 123.
{{< /direction >}}

Nested {{< bidi dir="rtl" >}}שלום {{< bidi dir="ltr" >}}C++{{< /bidi >}}!{{< /bidi >}}.

Use `curl -I https://example.org/a?x=1&y=2`.

```go {linenos=table}
fmt.Println("hello / سلام")
```

{{< direction dir="ltr" lang="en" >}}
{{< codecaption title="Caption" lang="go" >}}
fmt.Println("caption")
{{< /codecaption >}}
{{< /direction >}}

{{< direction dir="rtl" lang="fa" >}}
HTTP در ابتدای این جمله است، ولی جهت جمله همچنان راست به چپ است.

نسخه {{< bidi dir="ltr" lang="en" >}}C++ (v1.2){{< /bidi >}} آماده است.

## اجرای `curl -I` و `C++`

| دستور | توضیح |
| --- | --- |
| `curl -I` | دریافت سرآیندها |
| `C++` | نام زبان |
| `--help` | راهنما |

* یک مورد فارسی.
* مورد دوم فارسی.
{{< /direction >}}

{{< direction dir="ltr" lang="en" >}}
* https://example.org/first
* https://example.org/second {{< bidi dir="rtl" lang="fa" >}}(توضیح فارسی){{< /bidi >}}
{{< /direction >}}

{{< direction dir="rtl" lang="fa" >}}
Before the nested block.

{{< direction dir="ltr" lang="en" >}}
Nested **block**.
{{< /direction >}}

After the nested block.
{{< /direction >}}
