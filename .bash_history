git push origin master
git checkout -b pagination
git push origin pagination
git checkout master
git merge pagination
git push origin master
git push origin random-term-generator
git push origin master
git checkout master
git merge random-term-generator
git branch -d random-term-generator
