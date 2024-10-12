class WidgetLookup {

    constructor() {

        this.normalPrayers = [
            { widgetId: 35454985, wikiName: 'Thick_Skin', name: 'Thick Skin' },
            { widgetId: 35454986, wikiName: 'Burst_of_Strength', name: 'Burst of Strength' },
            { widgetId: 35454987, wikiName: 'Clarity_of_Thought', name: 'Clarity of Thought' },
            { widgetId: 35454988, wikiName: 'Rock_Skin', name: 'Rock Skin' },
            { widgetId: 35454989, wikiName: 'Superhuman_Strength', name: 'Superhuman Strength' },
            { widgetId: 35454990, wikiName: 'Improved_Reflexes', name: 'Improved Reflexes' },
            { widgetId: 35454991, wikiName: 'Rapid_Restore', name: 'Rapid Restore' },
            { widgetId: 35454992, wikiName: 'Rapid_Heal', name: 'Rapid Heal' },
            { widgetId: 35454993, wikiName: 'Protect_Item', name: 'Protect Item' },
            { widgetId: 35454994, wikiName: 'Steel_Skin', name: 'Steel Skin' },
            { widgetId: 35454995, wikiName: 'Ultimate_Strength', name: 'Ultimate Strength' },
            { widgetId: 35454996, wikiName: 'Incredible_Reflexes', name: 'Incredible Reflexes' },
            { widgetId: 35454997, wikiName: 'Protect_from_Magic_overhead', name: 'Protect from Magic' },
            { widgetId: 35454998, wikiName: 'Protect_from_Missiles_overhead', name: 'Protect from Missiles' },
            { widgetId: 35454999, wikiName: 'Protect_from_Melee_overhead', name: 'Protect from Melee' },
            { widgetId: 35455000, wikiName: 'Retribution', name: 'Retribution' },
            { widgetId: 35455001, wikiName: 'Redemption', name: 'Redemption' },
            { widgetId: 35455002, wikiName: 'Smite', name: 'Smite' },
            { widgetId: 35455003, wikiName: 'Sharp_Eye', name: 'Sharp Eye' },
            { widgetId: 35455004, wikiName: 'Hawk_Eye', name: 'Hawk Eye' },
            { widgetId: 35455005, wikiName: 'Eagle_Eye', name: 'Eagle Eye' },
            { widgetId: 35455006, wikiName: 'Mystic_Will', name: 'Mystic Will' },
            { widgetId: 35455007, wikiName: 'Mystic_Lore', name: 'Mystic Lore' },
            { widgetId: 35455008, wikiName: 'Mystic_Might', name: 'Mystic Might' },
            { widgetId: 35455009, wikiName: 'Rigour', name: 'Rigour' },
            { widgetId: 35455010, wikiName: 'Chivalry', name: 'Chivalry' },
            { widgetId: 35455011, wikiName: 'Piety', name: 'Piety' },
            { widgetId: 35455012, wikiName: 'Augury', name: 'Augury' },
            { widgetId: 35455013, wikiName: 'Preserve', name: 'Preserve' }
        ];

        this.other = [
            { type: 'LastActionItem', wikiName: 'Attack_icon', name: 'Attack last actor' },
        ];

        this.orbs = [
            { widgetType: 'Toggle run', wikiName: 'Run_energy_orb', name: 'Toggle Run' },
            { widgetType: 'Quick prayer', wikiName: 'Prayer_icon_(detail)', name: 'Quick Prayer' },
            { widgetType: 'Special attack', wikiName: 'Special_attack_orb', name: 'Special Attack' }
        ];

        this.standardSpells = [
            { widgetId: 14286855, wikiName: 'Lumbridge_Home_Teleport', name: 'Lumbridge Home Teleport' },
            { widgetId: 14286856, wikiName: 'Wind_Strike', name: 'Wind Strike' },
            { widgetId: 14286857, wikiName: 'Confuse', name: 'Confuse' },
            { widgetId: 14286858, wikiName: 'Crossbow_Bolt_Enchantments', name: 'Crossbow Bolt Enchantments' },
            { widgetId: 14286859, wikiName: 'Water_Strike', name: 'Water Strike' },
            { widgetId: 14286860, wikiName: 'Jewellery_Enchantments', name: 'Jewellery Enchantments' },
            { widgetId: 14286862, wikiName: 'Earth_Strike', name: 'Earth Strike' },
            { widgetId: 14286863, wikiName: 'Weaken', name: 'Weaken' },
            { widgetId: 14286864, wikiName: 'Fire_Strike', name: 'Fire Strike' },
            { widgetId: 14286865, wikiName: 'Bones_to_Bananas', name: 'Bones to Bananas' },
            { widgetId: 14286866, wikiName: 'Wind_Bolt', name: 'Wind Bolt' },
            { widgetId: 14286867, wikiName: 'Curse', name: 'Curse' },
            { widgetId: 14286868, wikiName: 'Bind', name: 'Bind' },
            { widgetId: 14286869, wikiName: 'Low_Level_Alchemy', name: 'Low Level Alchemy' },
            { widgetId: 14286870, wikiName: 'Water_Bolt', name: 'Water Bolt' },
            { widgetId: 14286871, wikiName: 'Varrock_Teleport', name: 'Varrock Teleport' },
            { widgetId: 14286873, wikiName: 'Earth_Bolt', name: 'Earth Bolt' },
            { widgetId: 14286874, wikiName: 'Lumbridge_Teleport', name: 'Lumbridge Teleport' },
            { widgetId: 14286875, wikiName: 'Telekinetic_Grab', name: 'Telekinetic Grab' },
            { widgetId: 14286876, wikiName: 'Fire_Bolt', name: 'Fire Bolt' },
            { widgetId: 14286877, wikiName: 'Falador_Teleport', name: 'Falador Teleport' },
            { widgetId: 14286878, wikiName: 'Crumble_Undead', name: 'Crumble Undead' },
            { widgetId: 14286879, wikiName: 'Teleport_to_House', name: 'Teleport to House' },
            { widgetId: 14286880, wikiName: 'Wind_Blast', name: 'Wind Blast' },
            { widgetId: 14286881, wikiName: 'Superheat_Item', name: 'Superheat Item' },
            { widgetId: 14286882, wikiName: 'Camelot_Teleport', name: 'Camelot Teleport' },
            { widgetId: 14286883, wikiName: 'Water_Blast', name: 'Water Blast' },
            { widgetId: 14286884, wikiName: 'Kourend_Castle_Teleport', name: 'Kourend Castle Teleport' },
            { widgetId: 14286886, wikiName: 'Iban_Blast', name: 'Iban Blast' },
            { widgetId: 14286887, wikiName: 'Snare', name: 'Snare' },
            { widgetId: 14286888, wikiName: 'Magic_Dart', name: 'Magic Dart' },
            { widgetId: 14286889, wikiName: 'Ardougne_Teleport', name: 'Ardougne Teleport' },
            { widgetId: 14286890, wikiName: 'Earth_Blast', name: 'Earth Blast' },
            { widgetId: 14286891, wikiName: 'Civitas_illa_Fortis_Teleport', name: 'Civitas illa Fortis Teleport' },
            { widgetId: 14286892, wikiName: 'High_Level_Alchemy', name: 'High Level Alchemy' },
            { widgetId: 14286893, wikiName: 'Charge_Water_Orb', name: 'Charge Water Orb' },
            { widgetId: 14286895, wikiName: 'Watchtower_Teleport', name: 'Watchtower Teleport' },
            { widgetId: 14286896, wikiName: 'Fire_Blast', name: 'Fire Blast' },
            { widgetId: 14286897, wikiName: 'Charge_Earth_Orb', name: 'Charge Earth Orb' },
            { widgetId: 14286898, wikiName: 'Bones_to_Peaches', name: 'Bones to Peaches' },
            { widgetId: 14286899, wikiName: 'Saradomin_Strike', name: 'Saradomin Strike' },
            { widgetId: 14286900, wikiName: 'Claws_of_Guthix', name: 'Claws of Guthix' },
            { widgetId: 14286901, wikiName: 'Flames_of_Zamorak', name: 'Flames of Zamorak' },
            { widgetId: 14286902, wikiName: 'Trollheim_Teleport', name: 'Trollheim Teleport' },
            { widgetId: 14286903, wikiName: 'Wind_Wave', name: 'Wind Wave' },
            { widgetId: 14286904, wikiName: 'Charge_Fire_Orb', name: 'Charge Fire Orb' },
            { widgetId: 14286905, wikiName: 'Ape_Atoll_Teleport', name: 'Ape Atoll Teleport' },
            { widgetId: 14286906, wikiName: 'Water_Wave', name: 'Water Wave' },
            { widgetId: 14286907, wikiName: 'Charge_Air_Orb', name: 'Charge Air Orb' },
            { widgetId: 14286908, wikiName: 'Vulnerability', name: 'Vulnerability' },
            { widgetId: 14286910, wikiName: 'Earth_Wave', name: 'Earth Wave' },
            { widgetId: 14286911, wikiName: 'Enfeeble', name: 'Enfeeble' },
            { widgetId: 14286912, wikiName: 'Teleother_Lumbridge', name: 'Teleother Lumbridge' },
            { widgetId: 14286913, wikiName: 'Fire_Wave', name: 'Fire Wave' },
            { widgetId: 14286914, wikiName: 'Entangle', name: 'Entangle' },
            { widgetId: 14286915, wikiName: 'Stun', name: 'Stun' },
            { widgetId: 14286916, wikiName: 'Charge', name: 'Charge' },
            { widgetId: 14286917, wikiName: 'Wind_Surge', name: 'Wind Surge' },
            { widgetId: 14286918, wikiName: 'Teleother_Falador', name: 'Teleother Falador' },
            { widgetId: 14286919, wikiName: 'Water_Surge', name: 'Water Surge' },
            { widgetId: 14286920, wikiName: 'Tele_Block', name: 'Tele Block' },
            { widgetId: 14286921, wikiName: 'Teleport_to_Target', name: 'Teleport to Target' },
            { widgetId: 14286923, wikiName: 'Teleother_Camelot', name: 'Teleother Camelot' },
            { widgetId: 14286924, wikiName: 'Earth_Surge', name: 'Earth Surge' },
            { widgetId: 14286926, wikiName: 'Fire_Surge', name: 'Fire Surge' }
        ];

        this.ancientSpells = [
            { widgetId: 14286927, wikiName: 'Ice_Rush', name: 'Ice Rush' },
            { widgetId: 14286928, wikiName: 'Ice_Blitz', name: 'Ice Blitz' },
            { widgetId: 14286929, wikiName: 'Ice_Burst', name: 'Ice Burst' },
            { widgetId: 14286930, wikiName: 'Ice_Barrage', name: 'Ice Barrage' },
            { widgetId: 14286931, wikiName: 'Blood_Rush', name: 'Blood Rush' },
            { widgetId: 14286932, wikiName: 'Blood_Blitz', name: 'Blood Blitz' },
            { widgetId: 14286933, wikiName: 'Blood_Burst', name: 'Blood Burst' },
            { widgetId: 14286934, wikiName: 'Blood_Barrage', name: 'Blood Barrage' },
            { widgetId: 14286935, wikiName: 'Smoke_Rush', name: 'Smoke Rush' },
            { widgetId: 14286936, wikiName: 'Smoke_Blitz', name: 'Smoke Blitz' },
            { widgetId: 14286937, wikiName: 'Smoke_Burst', name: 'Smoke Burst' },
            { widgetId: 14286938, wikiName: 'Smoke_Barrage', name: 'Smoke Barrage' },
            { widgetId: 14286939, wikiName: 'Shadow_Rush', name: 'Shadow Rush' },
            { widgetId: 14286940, wikiName: 'Shadow_Blitz', name: 'Shadow Blitz' },
            { widgetId: 14286941, wikiName: 'Shadow_Burst', name: 'Shadow Burst' },
            { widgetId: 14286942, wikiName: 'Shadow_Barrage', name: 'Shadow Barrage' },
            { widgetId: 14286943, wikiName: 'Paddewwa_Teleport', name: 'Paddewwa Teleport' },
            { widgetId: 14286944, wikiName: 'Senntisten_Teleport', name: 'Senntisten Teleport' },
            { widgetId: 14286945, wikiName: 'Kharyrll_Teleport', name: 'Kharyrll Teleport' },
            { widgetId: 14286946, wikiName: 'Lassar_Teleport', name: 'Lassar Teleport' },
            { widgetId: 14286947, wikiName: 'Dareeyak_Teleport', name: 'Dareeyak Teleport' },
            { widgetId: 14286948, wikiName: 'Carrallanger_Teleport', name: 'Carrallanger Teleport' },
            { widgetId: 14286949, wikiName: 'Annakarl_Teleport', name: 'Annakarl Teleport' },
            { widgetId: 14286950, wikiName: 'Ghorrock_Teleport', name: 'Ghorrock Teleport' },
            { widgetId: 14286951, wikiName: 'Edgeville_Home_Teleport', name: 'Edgeville Home Teleport' }
        ];

        this.lunarSpells = [
            { widgetId: 14286952, wikiName: 'Lunar_Home_Teleport', name: 'Lunar Home Teleport' },
            { widgetId: 14286953, wikiName: 'Bake_Pie', name: 'Bake Pie' },
            { widgetId: 14286954, wikiName: 'Cure_Plant', name: 'Cure Plant' },
            { widgetId: 14286955, wikiName: 'Monster_Examine', name: 'Monster Examine' },
            { widgetId: 14286956, wikiName: 'NPC_Contact', name: 'NPC Contact' },
            { widgetId: 14286957, wikiName: 'Cure_Other', name: 'Cure Other' },
            { widgetId: 14286958, wikiName: 'Humidify', name: 'Humidify' },
            { widgetId: 14286959, wikiName: 'Moonclan_Teleport', name: 'Moonclan Teleport' },
            { widgetId: 14286960, wikiName: 'Tele_Group_Moonclan', name: 'Tele Group Moonclan' },
            { widgetId: 14286961, wikiName: 'Cure_Me', name: 'Cure Me' },
            { widgetId: 14286962, wikiName: 'Hunter_Kit', name: 'Hunter Kit' },
            { widgetId: 14286963, wikiName: 'Waterbirth_Teleport', name: 'Waterbirth Teleport' },
            { widgetId: 14286964, wikiName: 'Tele_Group_Waterbirth', name: 'Tele Group Waterbirth' },
            { widgetId: 14286965, wikiName: 'Cure_Group', name: 'Cure Group' },
            { widgetId: 14286966, wikiName: 'Stat_Spy', name: 'Stat Spy' },
            { widgetId: 14286967, wikiName: 'Barbarian_Teleport', name: 'Barbarian Teleport' },
            { widgetId: 14286968, wikiName: 'Tele_Group_Barbarian', name: 'Tele Group Barbarian' },
            { widgetId: 14286969, wikiName: 'Superglass_Make', name: 'Superglass Make' },
            { widgetId: 14286970, wikiName: 'Tan_Leather', name: 'Tan Leather' },
            { widgetId: 14286971, wikiName: 'Khazard_Teleport', name: 'Khazard Teleport' },
            { widgetId: 14286972, wikiName: 'Tele_Group_Khazard', name: 'Tele Group Khazard' },
            { widgetId: 14286973, wikiName: 'Dream', name: 'Dream' },
            { widgetId: 14286974, wikiName: 'String_Jewellery', name: 'String Jewellery' },
            { widgetId: 14286975, wikiName: 'Stat_Restore_Pot_Share', name: 'Stat Restore Pot Share' },
            { widgetId: 14286976, wikiName: 'Magic_Imbue', name: 'Magic Imbue' },
            { widgetId: 14286977, wikiName: 'Fertile_Soil', name: 'Fertile Soil' },
            { widgetId: 14286978, wikiName: 'Boost_Potion_Share', name: 'Boost Potion Share' },
            { widgetId: 14286979, wikiName: 'Fishing_Guild_Teleport', name: 'Fishing Guild Teleport' },
            { widgetId: 14286980, wikiName: 'Tele_Group_Fishing_Guild', name: 'Tele Group Fishing Guild' },
            { widgetId: 14286981, wikiName: 'Plank_Make', name: 'Plank Make' },
            { widgetId: 14286982, wikiName: 'Catherby_Teleport', name: 'Catherby Teleport' },
            { widgetId: 14286983, wikiName: 'Tele_Group_Catherby', name: 'Tele Group Catherby' },
            { widgetId: 14286984, wikiName: 'Recharge_Dragonstone', name: 'Recharge Dragonstone' },
            { widgetId: 14286985, wikiName: 'Ice_Plateau_Teleport', name: 'Ice Plateau Teleport' },
            { widgetId: 14286986, wikiName: 'Tele_Group_Ice_Plateau', name: 'Tele Group Ice Plateau' },
            { widgetId: 14286987, wikiName: 'Energy_Transfer', name: 'Energy Transfer' },
            { widgetId: 14286988, wikiName: 'Heal_Other', name: 'Heal Other' },
            { widgetId: 14286989, wikiName: 'Vengeance_Other', name: 'Vengeance Other' },
            { widgetId: 14286990, wikiName: 'Vengeance', name: 'Vengeance' },
            { widgetId: 14286991, wikiName: 'Heal_Group', name: 'Heal Group' },
            { widgetId: 14286992, wikiName: 'Spellbook_Swap', name: 'Spellbook Swap' },
            { widgetId: 14286993, wikiName: 'Geomancy', name: 'Geomancy' },
            { widgetId: 14286994, wikiName: 'Spin_Flax', name: 'Spin Flax' },
            { widgetId: 14286995, wikiName: 'Ourania_Teleport', name: 'Ourania Teleport' }
        ];        

        this.arceuusSpells = [
            { widgetId: 14286996, wikiName: 'Arceuus_Home_Teleport', name: 'Arceuus Home Teleport' },
            { widgetId: 14286997, wikiName: 'Basic_Reanimation', name: 'Basic Reanimation' },
            { widgetId: 14286998, wikiName: 'Arceuus_Library_Teleport', name: 'Arceuus Library Teleport' },
            { widgetId: 14286999, wikiName: 'Adept_Reanimation', name: 'Adept Reanimation' },
            { widgetId: 14287000, wikiName: 'Expert_Reanimation', name: 'Expert Reanimation' },
            { widgetId: 14287001, wikiName: 'Master_Reanimation', name: 'Master Reanimation' },
            { widgetId: 14287002, wikiName: 'Draynor_Manor_Teleport', name: 'Draynor Manor Teleport' },
            { widgetId: 14287004, wikiName: 'Mind_Altar_Teleport', name: 'Mind Altar Teleport' },
            { widgetId: 14287005, wikiName: 'Respawn_Teleport', name: 'Respawn Teleport' },
            { widgetId: 14287006, wikiName: 'Salve_Graveyard_Teleport', name: 'Salve Graveyard Teleport' },
            { widgetId: 14287007, wikiName: 'Fenkenstrain_Castle_Teleport', name: 'Fenkenstrain Castle Teleport' },
            { widgetId: 14287008, wikiName: 'West_Ardougne_Teleport', name: 'West Ardougne Teleport' },
            { widgetId: 14287009, wikiName: 'Harmony_Island_Teleport', name: 'Harmony Island Teleport' },
            { widgetId: 14287010, wikiName: 'Cemetery_Teleport', name: 'Cemetery Teleport' },
            { widgetId: 14287011, wikiName: 'Resurrect_Crops', name: 'Resurrect Crops' },
            { widgetId: 14287012, wikiName: 'Barrows_Teleport', name: 'Barrows Teleport' },
            { widgetId: 14287013, wikiName: 'Ape_Atoll_Teleport', name: 'Ape Atoll Teleport' },
            { widgetId: 14287014, wikiName: 'Battlefront_Teleport', name: 'Battlefront Teleport' },
            { widgetId: 14287015, wikiName: 'Inferior_Demonbane', name: 'Inferior Demonbane' },
            { widgetId: 14287016, wikiName: 'Superior_Demonbane', name: 'Superior Demonbane' },
            { widgetId: 14287017, wikiName: 'Dark_Demonbane', name: 'Dark Demonbane' },
            { widgetId: 14287018, wikiName: 'Mark_of_Darkness', name: 'Mark of Darkness' },
            { widgetId: 14287019, wikiName: 'Ghostly_Grasp', name: 'Ghostly Grasp' },
            { widgetId: 14287020, wikiName: 'Skeletal_Grasp', name: 'Skeletal Grasp' },
            { widgetId: 14287021, wikiName: 'Undead_Grasp', name: 'Undead Grasp' },
            { widgetId: 14287022, wikiName: 'Ward_of_Arceuus', name: 'Ward of Arceuus' },
            { widgetId: 14287023, wikiName: 'Lesser_Corruption', name: 'Lesser Corruption' },
            { widgetId: 14287024, wikiName: 'Greater_Corruption', name: 'Greater Corruption' },
            { widgetId: 14287025, wikiName: 'Demonic_Offering', name: 'Demonic Offering' },
            { widgetId: 14287026, wikiName: 'Sinister_Offering', name: 'Sinister Offering' },
            { widgetId: 14287027, wikiName: 'Degrime', name: 'Degrime' },
            { widgetId: 14287028, wikiName: 'Shadow_Veil', name: 'Shadow Veil' },
            { widgetId: 14287029, wikiName: 'Vile_Vigour', name: 'Vile Vigour' },
            { widgetId: 14287030, wikiName: 'Dark_Lure', name: 'Dark Lure' },
            { widgetId: 14287031, wikiName: 'Death_Charge', name: 'Death Charge' },
            { widgetId: 14287032, wikiName: 'Resurrect_Lesser_Ghost', name: 'Resurrect Lesser Ghost' },
            { widgetId: 14287033, wikiName: 'Resurrect_Lesser_Skeleton', name: 'Resurrect Lesser Skeleton' },
            { widgetId: 14287034, wikiName: 'Resurrect_Lesser_Zombie', name: 'Resurrect Lesser Zombie' },
            { widgetId: 14287035, wikiName: 'Resurrect_Superior_Ghost', name: 'Resurrect Superior Ghost' },
            { widgetId: 14287036, wikiName: 'Resurrect_Superior_Skeleton', name: 'Resurrect Superior Skeleton' },
            { widgetId: 14287037, wikiName: 'Resurrect_Superior_Zombie', name: 'Resurrect Superior Zombie' },
            { widgetId: 14287038, wikiName: 'Resurrect_Greater_Ghost', name: 'Resurrect Greater Ghost' },
            { widgetId: 14287039, wikiName: 'Resurrect_Greater_Skeleton', name: 'Resurrect Greater Skeleton' },
            { widgetId: 14287040, wikiName: 'Resurrect_Greater_Zombie', name: 'Resurrect Greater Zombie' }
        ];        

        this.allWidgets = [
            ...this.normalPrayers,
            ...this.other,
            ...this.orbs,
            ...this.standardSpells,
            ...this.ancientSpells,
            ...this.lunarSpells,
            ...this.arceuusSpells
        ];
    }

    fetchWidgetName(widgetId) {
        let widget = undefined;

        // check if widgetId is all numbers
        if(/^\d+$/.test(widgetId)) {
            widget = this.allWidgets.find(w => w.widgetId == widgetId);
        }else{
            widgetId == 'LastActionItem' ? widget = this.allWidgets.find(w => w.type == widgetId) : widget = this.allWidgets.find(w => w.widgetType == widgetId);
        }

        return widget ? widget.name : '';
    }

    fetchItemImage(widgetId) {

        let widget = undefined;

        // check if widgetId is all numbers
        if(/^\d+$/.test(widgetId)) {
            widget = this.allWidgets.find(w => w.widgetId == widgetId);
        }else{
            widgetId == 'LastActionItem' ? widget = this.allWidgets.find(w => w.type == widgetId) : widget = this.allWidgets.find(w => w.widgetType == widgetId);
        }
        
        let wikiName = widget.wikiName;

        if(!wikiName.includes('.')){
            wikiName += '.png';
        }

        wikiName = encodeURIComponent(wikiName);

        return widget ? `https://oldschool.runescape.wiki/images/${wikiName}` : '';
    }
}

var widgetLookup = new WidgetLookup();