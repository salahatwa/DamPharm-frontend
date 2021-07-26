import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { IInvoice, ItemInvoice } from 'src/app/core/classes/invoice';
import { UserService } from 'src/app/shared/services/auth/user.service';
import { User } from 'src/app/core/classes/user.model';
import { Observable, Observer } from 'rxjs';

declare var html2pdf: any;

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerDialogComponent implements OnInit {

  isLoading: boolean;

  @Input() invoice: IInvoice;

  currentUser: User;


  constructor(private userService: UserService, public activeModal: NgbActiveModal, private http: HttpClient) {
    this.addScript('./assets/js/html2pdf.bundle.js');
  }

  addScript(url) {
    var script = document.createElement('script');
    script.type = 'application/javascript';
    script.src = url;
    document.head.appendChild(script);
  }
  base64ImageString;

  ngOnInit(): void {

    this.userService.currentUser.subscribe(data => {
      this.currentUser = data;



      this.getBase64ImageFromURL(this.currentUser?.companyLogo).subscribe((base64Data: string) => {
        this.base64ImageString = base64Data;
        console.log(base64Data);
      });
    });


  }

  public downloadPDF(): void {
    var element = document.getElementById('htmlData');
    var opt = {
      margin: 0,
      filename: this.invoice.id + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { dpi: 95, scale: 5, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
      var totalPages = pdf.internal.getNumberOfPages();
      let i: number = 0;
      for (i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        this.pageHeight = pdf.internal.pageSize.getHeight();
      }


    }).save();

  }

  itemTotalAfterDiscount(item: ItemInvoice) {
    let amount = (item?.quantity * item?.product?.price);
    if (item?.discount) {
      let discount = amount - ((amount * item?.discount) / 100);
      amount = discount;
    }
    return amount;
  }

  itemSubtotal(invoice: IInvoice) {
    let totalSum = 0;
    invoice?.items.forEach((item) => {
      totalSum += this.itemTotalAfterDiscount(item);
    });
    return totalSum;
  }

  /* Method to fetch image from Url */
  getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  /* Method to create base64Data Url from fetched image */
  getBase64Image(img: HTMLImageElement): string {
    // We create a HTML canvas object that will create a 2d image
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL: string = canvas.toDataURL("image/png");
    // this.base64ImageString = dataURL;
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
  }

}
