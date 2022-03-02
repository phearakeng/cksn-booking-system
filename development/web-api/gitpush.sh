read -p "git commit MSG :) ->   :" MSG  
read -p "Push later ? N/Y :) -> :" yn
if [ "$yn" == "y" ] ||  [ "$yn" == "Y" ] ;
then
   if [ "$MSG" != "" ] 
    then
             exec git add .
             exec git commit -m $MSG
             exec git push origin
             echo "Awesome :>, thank you very"
    else
        echo "git commit MSG :> is needed"
    fi
else 
    if [ "$MSG" != "" ];
    then
             exec git add .
             exec git commit -m $MSG
             echo "Awesome, no pushed :>, thank you very"
    else
        echo "git commit MSG :> is needed"
    fi
fi