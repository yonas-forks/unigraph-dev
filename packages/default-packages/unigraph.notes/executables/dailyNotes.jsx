const d = new Date();
const utcTime = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0)).toISOString();
const dateStr = d.getUTCFullYear() + '-' + (d.getUTCMonth()+1) + '-' + d.getUTCDate()

const [note, setNote] = React.useState({});
React.useEffect(() => {
    const subsId = getRandomInt();
    
    window.unigraph.subscribeToQuery(
        `(func: uid(res)) @filter(type(Entity) AND (NOT type(Deleted)) AND (NOT eq(<_hide>, true))) {
            uid
            type { <unigraph.id> }
        }
        point as var(func: uid(partf)) @cascade {
            _value {
                datetime @filter(eq(<_value.%dt>, "${utcTime}")) {
                    <_value.%dt>
                }
            }
        }
        var(func: eq(<unigraph.id>, "$/schema/time_point")) {
            <~type> {
                partf as uid
            }
        }
        var(func: uid(point)) @cascade {
            <unigraph.origin> {
                type @filter(eq(<unigraph.id>, "$/schema/journal")) {
                    <~type> {res as uid}
                }
            }
        }`
,
    (results) => {
        console.log('',{results})
        setNote(results?.[0])
    }, subsId, true);

    return function cleanup () {
        window.unigraph.unsubscribe(subsId);
    }
}, []);

return ((note && note?.['type']?.['unigraph.id'] === "$/schema/journal") ? <AutoDynamicViewDetailed object={note} /> : <div>
    <Button style={{textTransform: "none", marginTop: "8px"}} variant="outlined" onClick={() => {
        window.unigraph.addObject({ 
            "date": {
                "datetime": utcTime,
                "all_day": true,
                "timezone": "local"
            }, "note": {
                "text": {"_value": dateStr, "type": {"unigraph.id":"$/schema/markdown"}}
            }
        }, "$/schema/journal")
    }}>+ Add daily note</Button>
</div>)