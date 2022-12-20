#!/bin/sh

SITE=$(gum choose "dbs" "fab" "treasures")

if [ $SITE = "treasures" ];
then
	ENV_FILE=$(gum file ./apps/treasures/env)
	cd ./apps/fab
	cp $ENV_FILE .env
	DOMAIN=$(grep APP_URL= .env | cut -d '=' -f2)
	REPO=$(grep REPO= .env | cut -d '=' -f2)

	# gum spin --spinner dot --title "Building Astro" --
	# find . -name "ara*.mp4" -exec cp {} /path/to/destination \;

	PRETTY_DOMAIN=$(gum style --padding "1 8" --foreground "#f87171" $DOMAIN)
	PRETTY_REPO=$(gum style --padding "1 8" --foreground "#a3e635" $REPO)
	echo $(gum join --align center "\n\nPreparing to Publish " "$PRETTY_DOMAIN" " to " "$PRETTY_REPO")
	gum confirm "This will push the website live" --selected.background "#f87171" && cd ./dist && echo $DOMAIN >| CNAME && git init && git add . && git commit -m \"auto-push\" && git branch -M main && git remote add origin git@github.com:$REPO.git && git push -f -u origin main || echo "That's okay too"
fi

if [ $SITE = "fab" ];
then
	SCOPE=$(gum choose "fab" "all" "shin")
	if [ $SCOPE = "shin" ];
	then
		ENV_FILE=$(gum file ./apps/fab/env)
		cd ./apps/fab
		cp $ENV_FILE .env
		DOMAIN=$(grep APP_URL= .env | cut -d '=' -f2)
		REPO=$(grep REPO= .env | cut -d '=' -f2)

		# gum spin --spinner dot --title "Building Astro" -- 
		npm run build

		PRETTY_DOMAIN=$(gum style --padding "1 8" --foreground "#f87171" $DOMAIN)
		PRETTY_REPO=$(gum style --padding "1 8" --foreground "#a3e635" $REPO)
		echo $(gum join --align center "\n\nPreparing to Publish " "$PRETTY_DOMAIN" " to " "$PRETTY_REPO")
		gum confirm "This will push the website live" --selected.background "#f87171" && cd ./dist && echo $DOMAIN >| CNAME && git init && git add . && git commit -m \"auto-push\" && git branch -M main && git remote add origin git@github.com:$REPO.git && git push -f -u origin main || echo "That's okay too"
	fi
else
	echo "hello"
fi