/// based on vs.language.java
'use strict';
define(["require", "exports", './pascalDef', 'monaco'], function (require, exports, languageDef, monaco) {
    monaco.Modes.registerMonarchDefinition('pascal', languageDef.language);
});
