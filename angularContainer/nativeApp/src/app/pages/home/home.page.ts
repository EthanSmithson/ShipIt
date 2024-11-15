import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonTab, IonTabBar, IonTabButton, IonIcon, IonButton, IonList, IonButtons, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFab, IonFabButton, IonFabList, IonPopover, IonInput, IonLabel, IonCol, IonNote, IonText, IonAvatar, IonRippleEffect, IonAccordion, IonAccordionGroup, IonModal, IonCheckbox, IonImg} from '@ionic/angular/standalone';
import { homeOutline, cubeOutline, cogOutline, personOutline, mapOutline, addOutline, add, musicalNotesOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackageCreationForm } from './form/packageCreation.page.form';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { FindEvents } from 'src/app/services/findEvents.service';
import { TicketMasterApiService } from 'src/app/services/ticketMasterApi.service';
import { inject, ViewChild } from '@angular/core';
import { ElementRef, Renderer2 } from '@angular/core';
import { UiUxService } from 'src/app/services/UiUx.service';
import { CheckboxCustomEvent } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OpenMap } from 'src/app/services/openMap.service';
import { Output, EventEmitter } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonTabs, IonTab, IonTabBar, IonTabButton, IonIcon, IonButton, IonList, IonButtons, IonItem, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonFab, IonFabButton, IonFabList, IonPopover, IonInput, ReactiveFormsModule, IonLabel, IonCol, IonNote, IonText, IonAvatar, IonRippleEffect, IonAccordion, IonAccordionGroup, IonModal, IonCheckbox, IonImg]
})
export class HomePage implements OnInit {

  form: any = FormGroup;
  presentingElement: any = null;
  latLng: any;
  // openMap: boolean;
  @ViewChild('mapTab') mapTab!: ElementRef;
  @ViewChild('homeTab') homeTab!: ElementRef;
  mapTabBtn: any;
  homeTabBtn: any;
  @ViewChild('mapEl') mapEl!: ElementRef;
  
  constructor(private formBuilder: FormBuilder, private cookieService: CookieService, private renderer: Renderer2, private actionSheetCtrl: ActionSheetController, private router:Router, private route: ActivatedRoute, public openMap: OpenMap) { }

  ngOnInit() {
    addIcons({ homeOutline, cubeOutline, cogOutline, personOutline, mapOutline, addOutline, add, musicalNotesOutline })

    this.form = new PackageCreationForm(this.formBuilder).createForm();
    console.log(this.form);

    this.TicketMasterApiService.getCurrentLocation().then(results => {
      console.log(results);
      this.TicketMasterApiService.geoHashing(results).subscribe((results: any) => {
        console.log(results.geoHash)
        if (results.geoHash) {
          this.FindEvents.getVenues(results).subscribe((results: any) => {
            console.log(results.nearbyVenues)
            let eventsList = [];
            for (let i=0; i<results.nearbyVenues.length; i++) {
              if (results.nearbyVenues[i].images[0].url) {
                eventsList.push(results.nearbyVenues[i])
              }
              this.events = eventsList
            }
          })
        }
      })
    })

    // this.FindEvents.getUserId({myCookie: this.cookieService.get("myCookie")}).subscribe((results: any) => {
    //   this.FindEvents.getEvents(results.userId).subscribe((results: any) => {
    //     console.log(results);
    //     this.packages = results;
    //     console.log(this.packages);
    //   })
    // });

    this.UiUxService.getMe({myCookie: this.cookieService.get("myCookie")}).subscribe((results: any) => {
      console.log(results);
      this.myName = results.firstName;
    })

    this.presentingElement = document.querySelector('.ion-page');

    if (this.openMap.latLng) {
      this.latLng = this.openMap.latLng
    } else {
      // this.latLng = 
    }

  }

  ionViewWillEnter() {
     if (this.openMap.isOpenMap) {
        this.openMapTab();
      }
      let loader = new Loader({
        apiKey: 'AIzaSyD4AJX7dsVR4DkYHUP-J3exqx9c4Q4ucL8',
        version: "weekly"
      })

      this.latLng = this.openMap.latLng
  
      loader
      .importLibrary('maps')
      .then(({Map}) => {
        new Map(this.mapEl.nativeElement, {
          center: this.latLng,
          zoom: 11, 
          styles: 
            [
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "poi.business",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "stylers": [
                  {
                    "visibility": "simplified"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "transit",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              }
            ]
          // mapId: "72dbc0caa69649c6"
        });
      })
      .catch((e) => {
        // do something
      });
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  @ViewChild("removeLabelInUseError") thisLabelError: any = ElementRef;

  private FindEvents = inject(FindEvents);
  private TicketMasterApiService = inject(TicketMasterApiService);
  private UiUxService = inject(UiUxService);
  userId: any;
  labelInUseError: any;
  labelCreatedAlert: any;
  packages: any;
  myName: any;
  events: any;

  submitPackage(formData: any) {
    let myCookie = this.cookieService.get("myCookie");
    formData["myCookie"] = myCookie;
    console.log(formData);
    this.FindEvents.getUserId(formData).subscribe((results: any) => {
      console.log(results);
      this.userId = results.userId;
      console.log(this.userId);
      if (this.userId != null) {
        formData['userId'] = this.userId;
        this.FindEvents.getSlug(formData).subscribe((results: any) => {
          // console.log(results)
          formData['slug'] = results.slug;
          // console.log(formData);
          if (results.slug != undefined && results.slug != null) {
            this.FindEvents.addPackage(formData).subscribe((results: any) => {
              console.log(results);
              if (results.dupe) {
                console.log(this.thisLabelError)
                this.labelInUseError = "Tracking Number is in Use.";
                // this.hideLabelError(this.labelInUseError);
              } else {
                this.TicketMasterApiService.createTracking(formData).subscribe((results: any) => {
                  console.log(results);
                })
                this.labelCreatedAlert = "Package Added!";
                this.hideLabelAlert(this.labelCreatedAlert);
              }
            })
          }
        })
      }
    })
  }

  removeThisPackage(trackingNumber: any) {
    console.log(trackingNumber);
    this.FindEvents.removePackage({"trackingNumber": trackingNumber}).subscribe((results: any) => {
      console.log(results);
    });
  }

  hideLabelAlert(data: any) {
    setTimeout(() => {
      this.labelCreatedAlert = "";
    }, 3000);
  }

  handleClickOutside(data: any) {

  }

  openProfModal() {
    console.log("test")
  }

  onProfModalClose() {
    
  }

  viewVenue(data: any) {
    this.router.navigate(['/venue'], { queryParams: { venueId: data } });
    // this.FindEvents.getVenuesEvents({"venueId": data}).subscribe((results: any) => {
    //   console.log(results)
    // });
  }

  openMapTab() {
    this.mapTabBtn = this.mapTab;
    this.mapTabBtn.el.click();
    this.openMap.isOpenMap = false;
  }

  openMainMap() {
    console.log(this.mapEl.nativeElement)
  }
  
}
