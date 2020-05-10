#!/bin/bash
gsettings set org.gnome.desktop.background picture-uri file://$(pwd)/images/$((RANDOM % 665)).jpg
