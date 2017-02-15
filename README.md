
GitBook Plugin to show demos, write less codes and show more demos
==============

### 1. You can use install it via **NPM** and save it to package.json:
```
$ npm install gitbook-plugin-demoshow --save
```

### 2. Add the plugin to `book.json` config
```
{
    "plugins": [ "demoshow"]
}
```

### 3. Include demoshow block in your markdown files.

src path must be relative to the current markdown file
```
{% demoshow src='./teach.html'%}{% enddemoshow %}
```
like:

![image](https://raw.githubusercontent.com/kaivean/gitbook-plugin-demoshow/master/doc/demo1.png)

if don't show source codes, add the parameter `onlyrun=1`
```
{% demoshow src='./teach.html', onlyrun='1'%}{% enddemoshow %}
```
like:

![image](https://raw.githubusercontent.com/kaivean/gitbook-plugin-demoshow/master/doc/demo2.png)

### 4. writing demo codes in teach.html

* you can use bootstrap.css(3.3.7), fontawesome font, and jquery(3.3.1) in html files

* only support the following tags:
    * `<link rel="stylesheet" href="xxx"></link>`： dependent external link must use this tag
    * `<script src="xxx"></script>`  dependent external script must use this tag
    * `<style></style>`： style codes must be in the tag, being showed in
    * `<template></template>`： html codes must wrap in the tag
    * `<script></script>`： javascript codes must wrap in the tag

* `NAMESPACE` is a placeholder, which will be replaced by this form of value, `demoshow-block-ns2021` , different demo have different value, in case that many demos has conficts


Example: teach.html
```html
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css"></link>
<script src="http://cdn.bootcss.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>

<style>
.NAMESPACE {
}
</style>

<template>
<div class="NAMESPACE">
    <button id="NAMESPACE-btn" type="button" class="btn btn-default" data-toggle="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</button>
</div>
</template>
<script>
$('#NAMESPACE-btn').tooltip();
</script>
```
---
# Recommend
[gitbook-scafflod](https://github.com/kaivean/gitbook-scafflod) is a scafflod, which bases on gitbook and contains many features to make write markdown and demo more convenient, to also make releasing and updating markdown on server more easy.

---
# License

MIT License
