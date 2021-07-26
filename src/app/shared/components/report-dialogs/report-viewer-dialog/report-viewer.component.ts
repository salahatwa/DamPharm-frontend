import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { IInvoice, ItemInvoice } from 'src/app/core/classes/invoice';
import { UserService } from 'src/app/shared/services/auth/user.service';
import { User } from 'src/app/core/classes/user.model';

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
      this.getBase64ImageFromUrl(this.currentUser.companyLogo).then(base64 => {
        this.base64ImageString = base64;
      })
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

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

}
