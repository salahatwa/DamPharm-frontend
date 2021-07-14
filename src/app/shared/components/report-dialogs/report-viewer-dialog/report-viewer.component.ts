import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { IInvoice } from 'src/app/core/classes/invoice';

declare var html2pdf: any;

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerDialogComponent implements OnInit {

  isLoading: boolean;

  @Input() invoice: IInvoice;


  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {
    this.addScript('./assets/js/html2pdf.bundle.js');
  }

  addScript(url) {
    var script = document.createElement('script');
    script.type = 'application/javascript';
    script.src = url;
    document.head.appendChild(script);
  }


  ngOnInit(): void {

  }

  public downloadPDF(): void {
    var element = document.getElementById('htmlData');
    var opt = {
      margin: 0,
      filename: 'Order_1' + '.pdf',
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

}
