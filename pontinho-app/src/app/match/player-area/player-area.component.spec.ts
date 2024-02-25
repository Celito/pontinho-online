import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAreaComponent } from './player-area.component';

describe('PlayerAreaComponent', () => {
  let component: PlayerAreaComponent;
  let fixture: ComponentFixture<PlayerAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
