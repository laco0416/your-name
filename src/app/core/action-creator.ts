import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import { EventEmitter, PRIMARY_EVENT_EMITTER } from './event-emitter';
import { UserKind } from './constants';
import { ParticipationService } from '../services/participation.service';

@Injectable()
export class ActionCreator {
  constructor(@Inject(PRIMARY_EVENT_EMITTER) private dispatcher: EventEmitter, private service: ParticipationService) {
  }

  checkUserKind(userKind: UserKind, checked: boolean): void {
    this.dispatcher.emit(checked ? 'includeUserKind' : 'excludeUserKind', userKind);
  }

  changeWaitingNumber(num: number): void {
    this.dispatcher.emit('changeWaitingNumber', num);
  }

  updateUsers(url: string): void {
    this.fetch(url).subscribe((dom: Document) => {
      const users = this.service.extractUsers(dom);
      const eventInfo = this.service.extractEventInfo(dom);

      this.dispatcher.emit('updateEventInfo', eventInfo);
      this.dispatcher.emit('updateUsers', users);
      this.dispatcher.emit('fetchingUsers', false);
    });
  }

  fetch(url: string): Observable<Document> {
    this.dispatcher.emit('fetchingUsers', true);
    return this.service.fetchDom(url);
  }
}
