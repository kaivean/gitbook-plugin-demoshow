
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
{% demoshow src='./html/teach-trans.html'%}{% enddemoshow %}
```
if don't show source codes, add the parameter `onlyrun=1`
```
{% demoshow src='./html/teach-trans.html', onlyrun='1'%}{% enddemoshow %}
```

---
# License

MIT License
