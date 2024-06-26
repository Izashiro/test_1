import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/user.model';
import { UserService } from 'src/app/shared/user.service';
import Utils from 'src/app/utils/utils';
import { CallUser, PeerService } from '../../services/peer.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
})
export class CallComponent implements OnInit {
  public joinedUsers: CallUser[] = [];
  public localStream!: MediaStream;
  public roomId: string = '';
  public isHideChat = true;
  userDetails = new User();

  constructor(
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private peerService: PeerService,
    private userService: UserService
  ) {}

  ngAfterViewInit(): void {
    this.listenNewUser();
    this.listenLeavedUser();
    this.detectScreenWith();
  }

  ngOnInit(): void {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    Utils.getMediaStream({ video: true, audio: true }).then((stream) => {
      this.localStream = stream;
      this.openPeer();
    });
    this.userService.getUserProfile().subscribe((res: any) => {
      this.userDetails = res['user'];
      console.log(this.userDetails);
    });
  }

  hideOrUnhideChat(): void {
    this.isHideChat = !this.isHideChat;
  }

  private detectScreenWith(): void {
    if (window.screen.width > 719) {
      setTimeout(() => {
        this.isHideChat = false;
      }, 200);
    }
  }

  private listenNewUser(): void {
    this.listenNewUserJoinRoom();
    this.listenNewUserStream();
  }

  private listenLeavedUser(): void {
    this.socketService.leavedId.subscribe((userPeerId) => {
      this.joinedUsers = this.joinedUsers.filter((x) => x.peerId != userPeerId);
    });
  }

  private listenNewUserJoinRoom(): void {
    this.socketService.joinedId.subscribe((newUserId) => {
      if (newUserId) {
        this.makeCall(newUserId);
      }
    });
  }

  private listenNewUserStream(): void {
    this.peerService.joinUser.subscribe((user) => {
      if (user) {
        if (this.joinedUsers.findIndex((u) => u.peerId === user.peerId) < 0) {
          this.joinedUsers.push(user);
        }
      }
    });
  }

  private openPeer(): void {
    this.peerService.openPeer(this.localStream).then((myPeerId) => {
      this.joinRoom(this.roomId, myPeerId);
    });
  }

  private makeCall(anotherPeerId: string): void {
    this.peerService.call(anotherPeerId, this.localStream);
  }

  private joinRoom(roomId: string, userPeerId: string): void {
    this.socketService.joinRoom(roomId, userPeerId);
  }
}
