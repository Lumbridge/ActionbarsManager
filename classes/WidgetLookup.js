class WidgetLookup {

    constructor() {
        this.widgets = [
            // other
            { type: 'LastActionItem', wikiName: 'Attack_icon' },
            // orbs
            { widgetType: 'Toggle run', wikiName: 'Run_energy_orb'},
            { widgetType: 'Quick prayer', wikiName: 'Prayer_icon_(detail)'},
            { widgetType: 'Special attack', wikiName: 'Special_attack_orb'},
            // prayers
            { widgetId: 35454985, wikiName: 'Thick_Skin' },
            { widgetId: 35454986, wikiName: 'Burst_of_Strength' },
            { widgetId: 35454987, wikiName: 'Clarity_of_Thought' },
            { widgetId: 35454988, wikiName: 'Rock_Skin' },
            { widgetId: 35454989, wikiName: 'Superhuman_Strength' },
            { widgetId: 35454990, wikiName: 'Improved_Reflexes' },
            { widgetId: 35454991, wikiName: 'Rapid_Restore' },
            { widgetId: 35454992, wikiName: 'Rapid_Heal' },
            { widgetId: 35454993, wikiName: 'Protect_Item' },
            { widgetId: 35454994, wikiName: 'Steel_Skin' },
            { widgetId: 35454995, wikiName: 'Ultimate_Strength' },
            { widgetId: 35454996, wikiName: 'Incredible_Reflexes' },
            { widgetId: 35454997, wikiName: 'Protect_from_Magic_overhead' },
            { widgetId: 35454998, wikiName: 'Protect_from_Missiles_overhead' },
            { widgetId: 35454999, wikiName: 'Protect_from_Melee_overhead' },
            { widgetId: 35455000, wikiName: 'Retribution' },
            { widgetId: 35455001, wikiName: 'Redemption' },
            { widgetId: 35455002, wikiName: 'Smite' },
            { widgetId: 35455003, wikiName: 'Sharp_Eye' },
            { widgetId: 35455004, wikiName: 'Hawk_Eye' },
            { widgetId: 35455005, wikiName: 'Eagle_Eye' },
            { widgetId: 35455006, wikiName: 'Mystic_Will' },
            { widgetId: 35455007, wikiName: 'Mystic_Lore' },
            { widgetId: 35455008, wikiName: 'Mystic_Might' },
            { widgetId: 35455009, wikiName: 'Rigour' },
            { widgetId: 35455010, wikiName: 'Chivalry' },
            { widgetId: 35455011, wikiName: 'Piety' },
            { widgetId: 35455012, wikiName: 'Augury' },
            { widgetId: 35455013, wikiName: 'Preserve' },
            // standard spells
            { widgetId: 14286855, wikiName: 'Lumbridge_Home_Teleport' },
            { widgetId: 14286856, wikiName: 'Wind_Strike' },
            { widgetId: 14286857, wikiName: 'Confuse' },
            { widgetId: 14286858, wikiName: 'Crossbow_Bolt_Enchantments' },
            { widgetId: 14286859, wikiName: 'Water_Strike' },
            { widgetId: 14286860, wikiName: 'Jewellery_Enchantments' },
            { widgetId: 14286862, wikiName: 'Earth_Strike' },
            { widgetId: 14286863, wikiName: 'Weaken' },
            { widgetId: 14286864, wikiName: 'Fire_Strike' },
            { widgetId: 14286865, wikiName: 'Bones_to_Bananas' },
            { widgetId: 14286866, wikiName: 'Wind_Bolt' },
            { widgetId: 14286867, wikiName: 'Curse' },
            { widgetId: 14286868, wikiName: 'Bind' },
            { widgetId: 14286869, wikiName: 'Low_Level_Alchemy' },
            { widgetId: 14286870, wikiName: 'Water_Bolt' },
            { widgetId: 14286871, wikiName: 'Varrock_Teleport' },
            { widgetId: 14286873, wikiName: 'Earth_Bolt' },
            { widgetId: 14286874, wikiName: 'Lumbridge_Teleport' },
            { widgetId: 14286875, wikiName: 'Telekinetic_Grab' },
            { widgetId: 14286876, wikiName: 'Fire_Bolt' },
            { widgetId: 14286877, wikiName: 'Falador_Teleport' },
            { widgetId: 14286878, wikiName: 'Crumble_Undead' },
            { widgetId: 14286879, wikiName: 'Teleport_to_House' },
            { widgetId: 14286880, wikiName: 'Wind_Blast' },
            { widgetId: 14286881, wikiName: 'Superheat_Item' },
            { widgetId: 14286882, wikiName: 'Camelot_Teleport' },
            { widgetId: 14286883, wikiName: 'Water_Blast' },
            { widgetId: 14286884, wikiName: 'Kourend_Castle_Teleport' },
            { widgetId: 14286886, wikiName: 'Iban_Blast' },
            { widgetId: 14286887, wikiName: 'Snare' },
            { widgetId: 14286888, wikiName: 'Magic_Dart' },
            { widgetId: 14286889, wikiName: 'Ardougne_Teleport' },
            { widgetId: 14286890, wikiName: 'Earth_Blast' },
            { widgetId: 14286891, wikiName: 'Civitas_illa_Fortis_Teleport' },
            { widgetId: 14286892, wikiName: 'High_Level_Alchemy' },
            { widgetId: 14286893, wikiName: 'Charge_Water_Orb' },
            { widgetId: 14286895, wikiName: 'Watchtower_Teleport' },
            { widgetId: 14286896, wikiName: 'Fire_Blast' },
            { widgetId: 14286897, wikiName: 'Charge_Earth_Orb' },
            { widgetId: 14286898, wikiName: 'Bones_to_Peaches' },
            { widgetId: 14286899, wikiName: 'Saradomin_Strike' },
            { widgetId: 14286900, wikiName: 'Claws_of_Guthix' },
            { widgetId: 14286901, wikiName: 'Flames_of_Zamorak' },
            { widgetId: 14286902, wikiName: 'Trollheim_Teleport' },
            { widgetId: 14286903, wikiName: 'Wind_Wave' },
            { widgetId: 14286904, wikiName: 'Charge_Fire_Orb' },
            { widgetId: 14286905, wikiName: 'Ape_Atoll_Teleport' },
            { widgetId: 14286906, wikiName: 'Water_Wave' },
            { widgetId: 14286907, wikiName: 'Charge_Air_Orb' },
            { widgetId: 14286908, wikiName: 'Vulnerability' },
            { widgetId: 14286910, wikiName: 'Earth_Wave' },
            { widgetId: 14286911, wikiName: 'Enfeeble' },
            { widgetId: 14286912, wikiName: 'Teleother_Lumbridge' },
            { widgetId: 14286913, wikiName: 'Fire_Wave' },
            { widgetId: 14286914, wikiName: 'Entangle' },
            { widgetId: 14286915, wikiName: 'Stun' },
            { widgetId: 14286916, wikiName: 'Charge' },
            { widgetId: 14286917, wikiName: 'Wind_Surge' },
            { widgetId: 14286918, wikiName: 'Teleother_Falador' },
            { widgetId: 14286919, wikiName: 'Water_Surge' },
            { widgetId: 14286920, wikiName: 'Tele_Block' },
            { widgetId: 14286921, wikiName: 'Teleport_to_Target' },
            { widgetId: 14286923, wikiName: 'Teleother_Camelot' },
            { widgetId: 14286924, wikiName: 'Earth_Surge' },
            { widgetId: 14286926, wikiName: 'Fire_Surge' },
            // ancient spells
            { widgetId: 14286927, wikiName: 'Ice_Rush' },
            { widgetId: 14286928, wikiName: 'Ice_Blitz' },
            { widgetId: 14286929, wikiName: 'Ice_Burst' },
            { widgetId: 14286930, wikiName: 'Ice_Barrage' },
            { widgetId: 14286931, wikiName: 'Blood_Rush' },
            { widgetId: 14286932, wikiName: 'Blood_Blitz' },
            { widgetId: 14286933, wikiName: 'Blood_Burst' },
            { widgetId: 14286934, wikiName: 'Blood_Barrage' },
            { widgetId: 14286935, wikiName: 'Smoke_Rush' },
            { widgetId: 14286936, wikiName: 'Smoke_Blitz' },
            { widgetId: 14286937, wikiName: 'Smoke_Burst' },
            { widgetId: 14286938, wikiName: 'Smoke_Barrage' },
            { widgetId: 14286939, wikiName: 'Shadow_Rush' },
            { widgetId: 14286940, wikiName: 'Shadow_Blitz' },
            { widgetId: 14286941, wikiName: 'Shadow_Burst' },
            { widgetId: 14286942, wikiName: 'Shadow_Barrage' },
            { widgetId: 14286943, wikiName: 'Paddewwa_Teleport' },
            { widgetId: 14286944, wikiName: 'Senntisten_Teleport' },
            { widgetId: 14286945, wikiName: 'Kharyrll_Teleport' },
            { widgetId: 14286946, wikiName: 'Lassar_Teleport' },
            { widgetId: 14286947, wikiName: 'Dareeyak_Teleport' },
            { widgetId: 14286948, wikiName: 'Carrallanger_Teleport' },
            { widgetId: 14286949, wikiName: 'Annakarl_Teleport' },
            { widgetId: 14286950, wikiName: 'Ghorrock_Teleport' },
            { widgetId: 14286951, wikiName: 'Edgeville_Home_Teleport' },
            // lunar spells
            { widgetId: 14286952, wikiName: 'Lunar_Home_Teleport' },
            { widgetId: 14286953, wikiName: 'Bake_Pie' },
            { widgetId: 14286954, wikiName: 'Cure_Plant' },
            { widgetId: 14286955, wikiName: 'Monster_Examine' },
            { widgetId: 14286956, wikiName: 'NPC_Contact' },
            { widgetId: 14286957, wikiName: 'Cure_Other' },
            { widgetId: 14286958, wikiName: 'Humidify' },
            { widgetId: 14286959, wikiName: 'Moonclan_Teleport' },
            { widgetId: 14286960, wikiName: 'Tele_Group_Moonclan' },
            { widgetId: 14286961, wikiName: 'Cure_Me' },
            { widgetId: 14286962, wikiName: 'Hunter_Kit' },
            { widgetId: 14286963, wikiName: 'Waterbirth_Teleport' },
            { widgetId: 14286964, wikiName: 'Tele_Group_Waterbirth' },
            { widgetId: 14286965, wikiName: 'Cure_Group' },
            { widgetId: 14286966, wikiName: 'Stat_Spy' },
            { widgetId: 14286967, wikiName: 'Barbarian_Teleport' },
            { widgetId: 14286968, wikiName: 'Tele_Group_Barbarian' },
            { widgetId: 14286969, wikiName: 'Superglass_Make' },
            { widgetId: 14286970, wikiName: 'Tan_Leather' },
            { widgetId: 14286971, wikiName: 'Khazard_Teleport' },
            { widgetId: 14286972, wikiName: 'Tele_Group_Khazard' },
            { widgetId: 14286973, wikiName: 'Dream' },
            { widgetId: 14286974, wikiName: 'String_Jewellery' },
            { widgetId: 14286975, wikiName: 'Stat_Restore_Pot_Share' },
            { widgetId: 14286976, wikiName: 'Magic_Imbue' },
            { widgetId: 14286977, wikiName: 'Fertile_Soil' },
            { widgetId: 14286978, wikiName: 'Boost_Potion_Share' },
            { widgetId: 14286979, wikiName: 'Fishing_Guild_Teleport' },
            { widgetId: 14286980, wikiName: 'Tele_Group_Fishing_Guild' },
            { widgetId: 14286981, wikiName: 'Plank_Make' },
            { widgetId: 14286982, wikiName: 'Catherby_Teleport' },
            { widgetId: 14286983, wikiName: 'Tele_Group_Catherby' },
            { widgetId: 14286984, wikiName: 'Recharge_Dragonstone' },
            { widgetId: 14286985, wikiName: 'Ice_Plateau_Teleport' },
            { widgetId: 14286986, wikiName: 'Tele_Group_Ice_Plateau' },
            { widgetId: 14286987, wikiName: 'Energy_Transfer' },
            { widgetId: 14286988, wikiName: 'Heal_Other' },
            { widgetId: 14286989, wikiName: 'Vengeance_Other' },
            { widgetId: 14286990, wikiName: 'Vengeance' },
            { widgetId: 14286991, wikiName: 'Heal_Group' },
            { widgetId: 14286992, wikiName: 'Spellbook_Swap' },
            { widgetId: 14286993, wikiName: 'Geomancy' },
            { widgetId: 14286994, wikiName: 'Spin_Flax' },
            { widgetId: 14286995, wikiName: 'Ourania_Teleport' },
            // arceuus spells
            { widgetId: 14286996, wikiName: 'Arceuus_Home_Teleport' },
            { widgetId: 14286997, wikiName: 'Basic_Reanimation' },
            { widgetId: 14286998, wikiName: 'Arceuus_Library_Teleport' },
            { widgetId: 14286999, wikiName: 'Adept_Reanimation' },
            { widgetId: 14287000, wikiName: 'Expert_Reanimation' },
            { widgetId: 14287001, wikiName: 'Master_Reanimation' },
            { widgetId: 14287002, wikiName: 'Draynor_Manor_Teleport' },
            { widgetId: 14287004, wikiName: 'Mind_Altar_Teleport' },
            { widgetId: 14287005, wikiName: 'Respawn_Teleport' },
            { widgetId: 14287006, wikiName: 'Salve_Graveyard_Teleport' },
            { widgetId: 14287007, wikiName: 'Fenkenstrain_Castle_Teleport' },
            { widgetId: 14287008, wikiName: 'West_Ardougne_Teleport' },
            { widgetId: 14287009, wikiName: 'Harmony_Island_Teleport' },
            { widgetId: 14287010, wikiName: 'Cemetery_Teleport' },
            { widgetId: 14287011, wikiName: 'Resurrect_Crops' },
            { widgetId: 14287012, wikiName: 'Barrows_Teleport' },
            { widgetId: 14287013, wikiName: 'Ape_Atoll_Teleport' },
            { widgetId: 14287014, wikiName: 'Battlefront_Teleport' },
            { widgetId: 14287015, wikiName: 'Inferior_Demonbane' },
            { widgetId: 14287016, wikiName: 'Superior_Demonbane' },
            { widgetId: 14287017, wikiName: 'Dark_Demonbane' },
            { widgetId: 14287018, wikiName: 'Mark_of_Darkness' },
            { widgetId: 14287019, wikiName: 'Ghostly_Grasp' },
            { widgetId: 14287020, wikiName: 'Skeletal_Grasp' },
            { widgetId: 14287021, wikiName: 'Undead_Grasp' },
            { widgetId: 14287022, wikiName: 'Ward_of_Arceuus' },
            { widgetId: 14287023, wikiName: 'Lesser_Corruption' },
            { widgetId: 14287024, wikiName: 'Greater_Corruption' },
            { widgetId: 14287025, wikiName: 'Demonic_Offering' },
            { widgetId: 14287026, wikiName: 'Sinister_Offering' },
            { widgetId: 14287027, wikiName: 'Degrime' },
            { widgetId: 14287028, wikiName: 'Shadow_Veil' },
            { widgetId: 14287029, wikiName: 'Vile_Vigour' },
            { widgetId: 14287030, wikiName: 'Dark_Lure' },
            { widgetId: 14287031, wikiName: 'Death_Charge' },
            { widgetId: 14287032, wikiName: 'Resurrect_Lesser_Ghost' },
            { widgetId: 14287033, wikiName: 'Resurrect_Lesser_Skeleton' },
            { widgetId: 14287034, wikiName: 'Resurrect_Lesser_Zombie' },
            { widgetId: 14287035, wikiName: 'Resurrect_Superior_Ghost' },
            { widgetId: 14287036, wikiName: 'Resurrect_Superior_Skeleton' },
            { widgetId: 14287037, wikiName: 'Resurrect_Superior_Zombie' },
            { widgetId: 14287038, wikiName: 'Resurrect_Greater_Ghost' },
            { widgetId: 14287039, wikiName: 'Resurrect_Greater_Skeleton' },
            { widgetId: 14287040, wikiName: 'Resurrect_Greater_Zombie' }
        ];
    }

    fetchItemImage(widgetId) {

        let widget = undefined;

        // check if widgetId is all numbers
        if(/^\d+$/.test(widgetId)) {
            widget = this.widgets.find(w => w.widgetId === widgetId);
        }else{
            widgetId === 'LastActionItem' ? widget = this.widgets.find(w => w.type === widgetId) : widget = this.widgets.find(w => w.widgetType === widgetId);
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