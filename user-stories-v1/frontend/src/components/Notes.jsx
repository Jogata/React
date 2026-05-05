const Notes = () => {
    const isLoading = false;
    const isError = false;
    const error = {};
    const isSuccess = true;
    const tableContent = [];

    let content;

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>{error.message}</p>
    }

    const test = [{
        user: "Seb",
        notes: [
            "Lion Helmet",
            "Blued Plate Armor",
            "Staff of Morana's Nimbus",
            "Unity of Extremes",
            "Alchemist's Set",
            "Song of the Valkyries",
            // red
            "Blued Plate Armor",
            "Song of the Valkyries",
            "Unity of Extremes",
            "Dragon's Heart",
            "Alucard's Amulet",
            "Shadow Queen's Scythes",
            "Creator's Feathering",
            "Shadow Queen's Scythes",
            "Blued Plate Armor",
            "Dragon's Heart",
            "Staff of Stubbornness",
            "Enslaved Demon",
            "Blade of the Immortals",
            "Dragon's Heart",
            "Creator's Feathering",
            "Enslaved Demon",
            "Devourer of Mages",
            "The Vanquished Absolute"
        ]
    }, {
        user: "Yas",
        notes: [
            "Creator's Feathering",
            // Red
            "Riversar's Tiara",
            "Song of the Valkyries",
            "Trickster's Cane",
            "Jarugardi's Sneer",
            "Staff of Stubbornness",
            "Evening Curfew",
            "Blued Plate Armor",
            "Dragon's Heart",
            "Creator's Feathering",
            "Jarugardi's Sneer",
            "Song of the Valkyries",
            "Enslaved Demon",
            "Asklepius' Staff",
            "Deadly Sting",
            "Trickster's Cane",
            "Ace in the Hole",
            "Dragon's Heart",
            "The Vanquished Absolute"
        ]
    }, {
        user: "Cor",
        notes: [
            // Red
            "Evil Genius Cuirass",
            "Ruler's Globus",
            "Primarch's Grasp",
            "Blued Plate Armor",
            "Evening Curfew",
            "Shining Armor",
            "Primarch's Grasp",
            "Evil Genius Cuirass",
            "Insatiable Wing Aegis",
            "Blued Plate Armor",
            "Devourer of Mages",
            "Alucard's Amulet",
            "Brazier of the Bloody Lotus",
            "Andvari's Fortitude Support",
            "Demigod's Wreath"
        ]
    }, {
        user: "Cel",
        notes: [
            // Red
            "Blued Plate Armor",
            "Light of Distant Stars",
            "Key to All Doors",
            "Devourer of Mages",
            "Sphere of Power",
            "Dragon's Heart",
            "Blued Plate Armor",
            "Simon's Enlightenment",
            "Key to All Doors",
            "Dragon's Heart",
            "Oracle's Censer",
            "Awakened Might",
            "Asklepius' Staff",
            "Echidna's Dark Hex",
            "Oracle's Censer",
            "Piercing Gaze",
            "Dragon's Heart",
            "Creator of Worlds"
        ]
    }, {
        user: "",
        notes: [
            "Oracle's Censer",
            "Thieves Guild Sign",
            // Red
            "Key to All Doors",
            "All-Seeing Eye",
            "Asklepius' Staff",
            "Aigrette of Nocturnal Cicadas",
            "Oracle's Censer",
            "Andvari's Fortitude Support",
            "Oracle's Censer",
            "Jarugardi's Sneer",
            "Thieves Guild Sign",
            "Simon's Enlightenment",
            "Key to All Doors",
            "Helm of Clear Thoughts",
            "Trickster's Cane",
            "Jarugardi's Sneer",
            "All-Seeing Eye",
            "Piercing Gaze",
            "Andvari's Fortitude Support",
            "Creator of Worlds"
        ]
    }, {
        user: "Iris",
        notes: [
            // Orange +4
            "Book of Prophecies",
            "Oracle's Censer",
            "Panoptic Orb",
            "Gro Bulgor's Poleaxe",
            "Sphere of Power",
            "Key to All Doors",
            // Red
            "Key to All Doors",
            "Blued Plate Armor",
            "All-Seeing Eye",
            "Shadow Queen's Scythes",
            "Light of Distant Stars",
            "Andvari's Fortitude Support",
            "All-Seeing Eye",
            "Aigrette of Nocturnal Cicadas",
            "Asklepius' Staff",
            "Simon's Enlightenment",
            "Key to All Doors",
            "Piercing Gaze",
            "Citadel Guardian",
            "Shadow Queen's Scythes",
            "Key to All Doors",
            "Helm of Clear Thoughts",
            "Simon's Enlightenment",
            "Creator of Worlds",
        ]
    }, {
        user: "Jhu",
        notes: [
            // violet
            "Dragon Shield",
            "Advisor",
            "Dragon Tooth",
            "Executioner's Sword",
            "Siren's Song",
            "Dragon Tooth",
            "World Tremor",
            "Dragon Tooth",
            "Blade Bow",
            "Apostle's Mace",
            "Executioner's Sword",
            "Cosmic Tremor",
            // Orange
            "Lion Helmet",
            "Cosmic Tremor",
            "Governor",
            "Gro Bulgor's Poleaxe",
            "Executioner's Sword",
            "Hellion Harpoon",
            "Governor",
            "Gro Bulgor's Poleaxe",
            "Lion Helmet",
            "Hellion Harpoon",
            "Cosmic Tremor",
            "Blade of the Immortals",
            "Executioner's Sword",
            "Hellion Harpoon",
            "Executioner's Sword",
            "Aquant's Trident",
            "Gro Bulgor's Poleaxe",
            "Shining Armor",
            "Governor",
            "Harunian Helm",
            "World Tremor",
            "Ruler's Globus",
            "Harunian Helm",
            "Staff of Stubbornness"
        ]
    }, {
        user: "Isaac",
        notes: [
            // Violet
            "Advisor",
            "Siege Crossbow",
            "Advisor",
            "Siege Crossbow",
            "Staff of Selena's Halo",
            "Apostle's Mace",
            "Siege Crossbow",
            "Staff of Morana's Nimbus",
            // Orange
            "Siege Crossbow",
            "Angel's Mace",
            "Governor",
            "Throwing Knives",
            "Staff of Selena's Halo",
            "Lycanthrope's Fang",
            "Throwing Knives",
            "Blade Bow",
            "Alchemist's Set",
            "Staff of Morana's Nimbus",
            "Alucard's Amulet",
            "Governor",
            "Blued Plate Armor",
            "Apostle's Mace",
            "Blade of the Immortals",
            "Throwing Knives",
            "Creator's Feathering",
            "Governor",
            "Blade of the Immortals",
            "Siege Crossbow",
            "Alucard's Amulet",
            "Alucard's Amulet",
            "Unity of Extremes"
        ]
    }];

    const imam = [
        "Lion Helmet",
"Blued Plate Armor",
"Staff of Morana's Nimbus",
"Unity of Extremes",
"Alchemist's Set",
"Song of the Valkyries",
"Dragon's Heart",
"Alucard's Amulet",
"Shadow Queen's Scythes",
"Creator's Feathering",
"Staff of Stubbornness",
"Enslaved Demon",
"Blade of the Immortals",
"Devourer of Mages",
"The Vanquished Absolute",
"Riversar's Tiara",
"Trickster's Cane",
"Jarugardi's Sneer",
"Evening Curfew",
"Asklepius' Staff",
"Deadly Sting",
"Ace in the Hole",
"Evil Genius Cuirass",
"Ruler's Globus",
"Primarch's Grasp",
"Shining Armor",
"Insatiable Wing Aegis",
"Brazier of the Bloody Lotus",
"Andvari's Fortitude Support",
"Demigod's Wreath",
"Light of Distant Stars",
"Key to All Doors",
"Sphere of Power",
"Simon's Enlightenment",
"Oracle's Censer",
"Awakened Might",
"Echidna's Dark Hex",
"Piercing Gaze",
"Creator of Worlds",
"Thieves Guild Sign",
"All-Seeing Eye",
"Aigrette of Nocturnal Cicadas",
"Helm of Clear Thoughts",
"Book of Prophecies",
"Panoptic Orb",
"Gro Bulgor's Poleaxe",
"Citadel Guardian",
"Dragon Shield",
"Advisor",
"Dragon Tooth",
"Executioner's Sword",
"Siren's Song",
"World Tremor",
"Blade Bow",
"Apostle's Mace",
"Cosmic Tremor",
"Governor",
"Hellion Harpoon",
"Aquant's Trident",
"Harunian Helm",
"Siege Crossbow",
"Staff of Selena's Halo",
"Angel's Mace",
"Throwing Knives",
"Lycanthrope's Fang"
    ]

    function all() {
    // test.reduce((acc, curr) => {
            const allNotes = test.reduce((all, user) => {
                // console.log(all);
                // return all;
                return all.concat(user.notes);
            }, [])
            console.log(allNotes);
            // console.log(curr.notes);
        // }, [])
        const reduced = [];

        // console.log(allNotes[2] === allNotes[7]);

        allNotes.forEach(note => {
            // console.log(reduced.length);
            const index = reduced.findIndex(item => item.name === note);
            // });
            
            if (index == -1) {
                // console.log(index);
                reduced.push({
                    name: note, 
                    count: 1
                })
            } else {
                reduced[index].count++;
            }
        })
        console.log(reduced);
        return reduced;
    }

    const reduced = all();

    content = (
        <ul>
            {reduced.map((item, index) => {
                return (
                    <li key={index}>{item.name}: {item.count}</li>
                )
            })}
        </ul>
    )

    // if (isSuccess) {
    //     content = (
    //         <table className="table notes">
    //             <thead className="table-thead">
    //                 <tr>
    //                     <th className="table-th note-status">Username</th>
    //                     <th className="table-th note-created">Created</th>
    //                     <th className="table-th note-updated">Updated</th>
    //                     <th className="table-th note-title">Title</th>
    //                     <th className="table-th note-username">Owner</th>
    //                     <th className="table-th note-edit">Edit</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {tableContent}
    //             </tbody>
    //         </table>
    //     )
    // }

    return content;
}

export default Notes;