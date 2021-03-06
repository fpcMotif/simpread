console.log( "=== simpread menu load ===" )

import {storage} from 'storage';
import {browser} from 'browser';
import * as msg  from 'message';

/**
 * Create context menus
*/
const context = {
        focus : { id: "", menu: {} },
        read  : { id: "", menu: {} },
        link  : { id: "", menu: {} },
        list  : { id: "", menu: {} },
    },
    menu = {
        "type"     : "normal",
        "contexts" :  [ "all" ],
        "documentUrlPatterns" : [ "http://*/*" , "https://*/*" ]
    };

Object.assign( context.focus.menu, menu, { id: "focus", "title" : "聚焦模式" });
Object.assign( context.read.menu,  menu, { id: "read",  "title" : "阅读模式" });
Object.assign( context.list.menu,  menu, { id: "list",  "title" : "打开稍后读" });
Object.assign( context.link.menu,  menu, { id: "link",  "title" : "使用阅读模式打开此链接", contexts: [ "link" ] });

/**
 * Listen contextMenus message
 */
function onClicked( callback ) {
    browser.contextMenus.onClicked.addListener( callback );
}

/**
 * Create all context menu
 */
function createAll() {
    storage.option.menu.focus &&
        ( context.focus.id = browser.contextMenus.create( context.focus.menu ));

    storage.option.menu.read &&
        ( context.read.id  = browser.contextMenus.create( context.read.menu ));

        storage.option.menu.link &&
        ( context.link.id  = browser.contextMenus.create( context.link.menu ));

    storage.option.menu.list &&
        ( context.list.id  = browser.contextMenus.create( context.list.menu ));
}

/**
 * Create menu from type
 * 
 * @param {string} include: foucs read link
 */
function create( type ) {
    if ( !context[type].id ) {
        delete context[type].menu.generatedId;
        context[type].id = browser.contextMenus.create( context[type].menu );
    }
}

/**
 * Remove menu from type
 * 
 * @param {string} include: foucs read link
 */
function remove( type ) {
    if ( context[type].id ) {
        browser.contextMenus.remove( context[type].id );
        context[type].id = undefined;
    }
}

/**
 * Refresh menu ( Enforcement fresh )
 * 
 * @param {object} new menu object 
 */
function refresh( cur ) {
    Object.keys( cur ).forEach( item => {
        browser.runtime.sendMessage( msg.Add( msg.MESSAGE_ACTION.menu, { id: item, value: cur[item] } ));
    });
}

export {
    createAll as CreateAll,
    create    as Create,
    remove    as Remove,
    refresh   as Refresh,
    onClicked as OnClicked,
}