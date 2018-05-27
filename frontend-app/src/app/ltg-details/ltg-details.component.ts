import { ColumnDTO } from './../DTOs/ColumnDTO';
import { ColumnsService } from './../api-handlers/Columns/columns.service';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { LongTermGoalsService } from '../api-handlers/LongTermGoals/long-term-goals.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LongTermGoalDTO } from '../DTOs/LongTermGoalDTO';

@Component({
  selector: 'app-ltg-details',
  templateUrl: './ltg-details.component.html',
  styleUrls: ['./ltg-details.component.css']
})
export class LtgDetailsComponent implements OnInit {

  ltgId: number;
  ltgName: string;

  ltgObject: LongTermGoalDTO;
  columns: ColumnDTO[];

  ltgUpdateQueue:boolean = false;
  columnUpdateQueue: number[] = [];

  enableAutosave: boolean = true; //user can choose if content should be autosaved
  lastSave: Date = new Date(); //datetime of last save to database
  @Output() taskChangedAction: EventEmitter<any> = new EventEmitter(); //event called after task modification and save

  newColumnName: string;

  constructor(
    public bsModalRef: BsModalRef,
    private ltgService: LongTermGoalsService,
    private columnService: ColumnsService) { }

  ngOnInit() {
    this.ltgService.getWithId<LongTermGoalDTO>(this.ltgId).subscribe(response => {
      this.ltgObject = response;
    });

    this.columnsReload();

    setInterval(() => this.autoSaveChanges(), 3000);
  }

  saveChanges(andCloseModal: boolean) {
    let anythingChanged = false;

    for(let q of this.columnUpdateQueue){
      for(let col of this.columns){
        if(col.id == q){
          anythingChanged = true;
          this.columnService.putWithId(col.id, col).subscribe();
          break;
        }
      }
    }
    this.columnUpdateQueue = [];

    if(this.ltgUpdateQueue){
      this.ltgService.putWithId(this.ltgId, this.ltgObject).subscribe();
      anythingChanged = true;
      this.ltgUpdateQueue = false;
    }

    if(anythingChanged){
      this.taskChangedAction.emit();
    }
    if (andCloseModal) {
      this.bsModalRef.hide();
    }
  }

  addColumnToUpdateQueue(columnId:number){
    this.columnUpdateQueue.push(columnId);
  }

  autoSaveChanges() {
    let currentTime = new Date();
    if (this.lastSave.getTime() + 1000 * 3 < currentTime.getTime() && this.enableAutosave) {
      this.saveChanges(false);
      this.lastSave = new Date();
    }
  }

  columnsReload() {
    this.columnService.getManyByLongTermGoalId(this.ltgId).subscribe(response => {
      this.columns = response;
    });
  }

  createNewColumn() {
    let newColumn = new ColumnDTO();
    newColumn.longTermGoalId = this.ltgId;
    newColumn.name = this.newColumnName;
    newColumn.orderIndex = this.columns.length;
    this.columnService.post<ColumnDTO>(newColumn).subscribe(response => {
      this.columnsReload();
    });
  }

  deleteColumn(columnId: number){
    this.columnService.deleteById(columnId).subscribe(response => {
      this.columnsReload();
    });
  }
}
