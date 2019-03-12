class LinkedList {
    constructor() {
        this.start = null;
    }
    printNodes(){
        let output='';
         while(this.start!=null){
             output +=this.start.value+' ';
             this.start=this.start.next;
         }
         return output;
    }
    findMidNode(){
        while(this.start!=null && this.prev!=null){
            //console.log(this.start);
            //console.log(this.prev);

            if(this.start.value==this.prev.value){
                return this.start.value;
            }
            this.start=this.start.next;
            this.prev=this.prev.prev;
        }

    }
}
class LinkedListNode {
    constructor(value, next = null, prev=null) {
        this.value = value;
        this.next  = next;
        this.prev=null;
    }
}


