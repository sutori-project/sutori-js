## 0.0.7 - 29th June 2022

- Simplified elements by replacing `<image>`, `<video>` and `<audio>` with just  `<media>`.

## 0.0.6 - 27th June 2022

- Fixed the new attribute loader system, attributes are read correctly now.
- Options were missing a read on the 'lang' attribute, fixed.
- Attributes casting to bool changed to include false as default value.
- Changed LoadXml to LoadXmlFile to mirror SutoriCS, LoadXml should be used for raw XML.
- Updated readme to be more approachable.