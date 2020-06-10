export default class SequencerEvent extends CustomEvent {
    static DATA_CHANGE = 'dataChange'
    static UPDATE(data){
        return new SequencerEvent(SequencerEvent.DATA_CHANGE, {detail:data})
    }
}