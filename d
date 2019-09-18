[1mdiff --git a/.gitignore b/.gitignore[m
[1mindex ff67c93..792c15b 100644[m
[1m--- a/.gitignore[m
[1m+++ b/.gitignore[m
[36m@@ -62,3 +62,4 @@[m [mtypings/[m
 [m
 # credentials[m
 credentials/*.json[m
[32m+[m[32mcredentials/*.md[m
[1mdiff --git a/robots/text.js b/robots/text.js[m
[1mindex ab7812c..a2fd10e 100644[m
[1m--- a/robots/text.js[m
[1m+++ b/robots/text.js[m
[36m@@ -11,8 +11,8 @@[m [masync function robot(content) {[m
   async function fetchContentFromWikipedia(content) {[m
     const algorithmiaAuthenticated = algorithmia('simK3ySDLgdiJr8/F61tTekynoi1')[m
     const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")[m
[31m-    const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)[m
[31m-    const wikipediaContent = wikipediaResponde.get()[m
[32m+[m[32m    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)[m
[32m+[m[32m    const wikipediaContent = wikipediaResponse.get()[m
 [m
     content.sourceContentOriginal = wikipediaContent.content[m
     console.log('> [text-robot] Fetching done!')[m
