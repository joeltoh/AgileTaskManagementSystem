/**
 * Author: Vince Dang
 * Defines Links collection
 */

import {Mongo} from 'meteor/mongo'

export const Links = new Mongo.Collection('links')

Links.publicFields = {}