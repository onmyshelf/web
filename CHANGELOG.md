# Changelog for OnMyShelf web interface

# 1.5.3 (2025-xx-xx)
- Minor improvements on server config page
- Updated libraries

# 1.5.2 (2025-03-15)
- Fixed bad component path
- Updated libraries

# 1.5.1 (2024-10-12)
- New buttons on import page
- Updated libraries

# 1.5.0 (2024-09-07)
## New features
- Autocompletion in item editor
- New page titles
## Improvements
- Code refactoring

# 1.4.0 (2024-08-23)
## New features
- New items search feature
- New borrowers management system
- New modules page in server config
## Improvements
- Autodetect browser language
## Bugfixes
- Fix bad use of the file property

# 1.3.2 (2024-08-13)
- Upgrade axios for security
- Minor code improvements

# 1.3.1 (2024-08-07)
## New features
- New configuation page to list installed modules
- New configuation page to test email
## Improvements
- Permit to import multiple items
## Bugfixes
- Minor fix to prevent console warns when no item cover

# 1.3.0 (2024-07-29)
## New features
- Support for item quantity
## Bugfixes
- Fixed regressive bug introduced in RC 1

# 1.3.0 RC 1 (2024-07-26)
## New features
- Users can choose who is able to borrow an item
- New pending loans badges
- New "lent" filter in collection sidebar
- New collection tags used by import modules
## Improvements
- Faster items navigation
- Not loosing filters when go back to collection
- And many more!
## Bugfixes
- Fixed properties order tool
- Added missing translations

# 1.3.0 BETA 1 (2024-07-12)
## New features
- Edit user firstname & lastname
- Permit users to log in with email address
- Print API version when admin is logged in
## Improvements
- Updated libraries
- Integration of Bootstrap inside project
- Various code refactoring
## Bugfixes
- Fixed bad redirection when user logs out
- Fixed various translations

# 1.2.0 (2024-04-27)
## New features
- New export collection tool

# 1.2.0 BETA 1 (2024-04-20)
## New features
- New server configuration page
- New users management pages
## Improvements
- Updated libraries
- Various code refactoring

# 1.1.1 (2024-03-31)
- Fixed pagination not working when page number is not set

# 1.1.0 (2024-03-16)
## Improvements
- Properties are prettier if no translation found
- Manage import search errors
## Bugfixes
- Fixed bad redirection after item import
- Fixed infinite loading in import search

# 1.1.0 RC 2 (2024-02-22)
## New features
- Import item from a custom URL
## Improvements
- Import item now redirects to item page
- Updated libraries
## Bugfixes
- Fixed bug when user changes password

# 1.1.0 RC 1 (2024-02-03)
## New features
- New collection templates selector
- New created/updated informations for collections and items
- New pagination system for items
- New interface to hide properties
## Bugfixes and improvements
- Improved filters and sorting interface
- Various UX improvements
- Updated libraries, CSS and icons
- Other fixes and code improvements

# 1.0.1 (2024-01-18)
- Improvements and fixes for item filters
- Updated libraries

# 1.0.0 (2023-11-25)
- Updated libraries

# 1.0.0 RC 5 (2023-08-09)
- Added missing translations
- Temporary disabled hiding properties to avoid loosing control on it (to be fixed)
- Hide loans when user is not logged in
- Fixed loans bad date times
- Fixed image gallery when there are multiple values
- Other fixes and improvements
- Updated libraries

# 1.0.0 RC 4 (2022-11-26)
- Add loans support
- Improved import item page
- Improved demo mode
- Various code improvements
- Updated libraries

# 1.0 RC 3 (2022-08-22)
- New translate system
- Interface is fully translated in French
- New button to toggle sidebar for small screens
- New filters selectors in collection vue
- Add support for many embeded video players
- Improved item editor and media selector
- Many design and UX improvements
- Various bugfixes
- Some code improvements

# 1.0 RC 2 (2022-07-22)
- New demo mode
- New button to duplicate an item
- New search bar in collections
- New page to search and import items from external sources
- Fix crash when setting searchable property
- Display thumbnails instead of full images
- Many design improvements
- Various code improvements

# 1.0 RC 1 (2022-05-28)
- Items sorting and filters are now working properly
- Upgrade VueJS 3.2.36, VueJS router 4.0.15 and axios 0.27.2
- Migrate from vue-cli to vite

# 1.0 Beta 2 (2021-12-27)
- Fixed responsive bugs
- Display mode is saved in the local storage
- Rename 'fields' to 'properties' for better understanding
- Various bugfixes
- Upgrade VueJS 3.2.26, VueJS router 4.0.12 and axios 0.24.0

# 1.0 Beta 1 (2021-10-09)
- Create, edit & delete collections
- Create, edit & delete fields
- Create, edit & delete items
- Import collections from GCstar, Tellico and CSV
