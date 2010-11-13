; $Id: README.txt,v 1.1.2.3 2010/04/12 21:59:04 tyabut Exp $
GDriving (Google Directions) module for Drupal 6.x

GDriving displays a form in GMap module markers that allows users to input an 
address and get directions in an overlay window.

This module was designed to work with Zen-based themes, and it assumes that your
theme has a content-bottom region.  If you don't, you may need to reconfigure
the gDriving block.

INSTALLATION
Install and Enable GMap
*See http://www.drupal.org/project/gmap

Install and Enable Jq
*See http://www.drupal.org/project/jq

Download GDriving.

Download the latest release of Facebox edited for this module at:
http://code.google.com/p/facebox-gdriving/downloads/list

Unzip/unpack the Facebox file.

Copy the contents of the facebox folder into your gdriving source folder. If the
folder exists already inside your gdriving source folder (there is a css folder
in both facebox and gdriving), copy the contents of the folder (facebox/css/* to
gdriving/css/*) into the relevant gdriving subfolder.


Upload gdriving to /sites/all/modules or sites/all/<domain/modules.

Enable the module in Administer > Site Building > Modules

Go to Administer > Site Building > Blocks and configure the GDriving Map 
Directions Block to appear on the pages or to the roles you wish. Do not enable 
or disable the block.  Instead, you should configure the pages it appears on or 
the roles to which it appears.

View a Google Map on one of the pages you've configured GDriving Map Directions 
Block to appear on and click on a marker.  Then try getting the driving 
directions.