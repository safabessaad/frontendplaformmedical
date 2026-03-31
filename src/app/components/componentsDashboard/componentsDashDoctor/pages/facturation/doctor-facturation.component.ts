import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type InvoiceStatus = 'Pending' | 'Paid' | 'Partial' | 'Cancelled';
interface InvoiceItem {
  id: string;
  patient: string;
  act: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: InvoiceStatus;
}

@Component({
  selector: 'app-doctor-facturation',
  templateUrl: './doctor-facturation.component.html',
  styleUrl: './doctor-facturation.component.scss',
  standalone: false,
})
export class DoctorFacturationComponent {
  protected showInvoiceForm = false;
  protected searchTerm = '';
  protected statusFilter: InvoiceStatus | 'All' = 'All';
  protected selectedInvoice: InvoiceItem | null = null;
  protected receiptMessage = '';
  protected selectedAccount = 'Treatment fund';
  protected addNote = '';
  protected selectedPaymentMethod = 'Cash';
  protected readonly quickAmounts = [20, 30, 50, 100];

  protected readonly invoiceForm = this.fb.group({
    patient: ['', [Validators.required]],
    act: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    dueDate: ['', [Validators.required]]
  });
  protected readonly paymentForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  protected invoices: InvoiceItem[] = [
    { id: '#INV-201', patient: 'Youssef El Idrissi', act: 'Consultation generale', amount: 450, paidAmount: 450, dueDate: '2026-03-16', status: 'Paid' },
    { id: '#INV-202', patient: 'Fatima Rachidi', act: 'Suivi HTA', amount: 350, paidAmount: 150, dueDate: '2026-03-20', status: 'Partial' },
    { id: '#INV-203', patient: 'Imane Bennani', act: 'Teleconsultation', amount: 300, paidAmount: 0, dueDate: '2026-03-21', status: 'Pending' }
  ];

  constructor(private readonly fb: FormBuilder) {}

  protected get filteredInvoices(): InvoiceItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.invoices.filter((item) => {
      const matchesTerm = !term || item.patient.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
      const matchesStatus = this.statusFilter === 'All' || item.status === this.statusFilter;
      return matchesTerm && matchesStatus;
    });
  }

  protected get totalInvoiced(): number { return this.invoices.reduce((sum, item) => sum + item.amount, 0); }
  protected get totalReceived(): number { return this.invoices.reduce((sum, item) => sum + item.paidAmount, 0); }
  protected get totalOutstanding(): number { return this.totalInvoiced - this.totalReceived; }
  protected get pendingCount(): number { return this.invoices.filter((item) => item.status === 'Pending').length; }
  protected toggleInvoiceForm(): void { this.showInvoiceForm = !this.showInvoiceForm; }

  protected createInvoice(): void {
    if (this.invoiceForm.invalid) return;
    const value = this.invoiceForm.getRawValue();
    const created: InvoiceItem = {
      id: `#INV-${Date.now().toString().slice(-4)}`,
      patient: value.patient ?? '',
      act: value.act ?? '',
      amount: Number(value.amount ?? 0),
      paidAmount: 0,
      dueDate: value.dueDate ?? '',
      status: 'Pending'
    };
    this.invoices = [created, ...this.invoices];
    this.selectedInvoice = created;
    this.invoiceForm.reset({ patient: '', act: '', amount: 0, dueDate: '' });
    this.showInvoiceForm = false;
  }

  protected selectInvoice(invoice: InvoiceItem): void {
    this.selectedInvoice = invoice;
    this.receiptMessage = '';
    this.paymentForm.reset({ amount: 0 });
  }

  protected recordPayment(): void {
    if (!this.selectedInvoice || this.paymentForm.invalid) return;
    const payment = Number(this.paymentForm.value.amount ?? 0);
    this.invoices = this.invoices.map((item) => {
      if (item.id !== this.selectedInvoice?.id) return item;
      const paidAmount = Math.min(item.amount, item.paidAmount + payment);
      const status: InvoiceStatus = paidAmount === item.amount ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending';
      return { ...item, paidAmount, status };
    });
    this.selectedInvoice = this.invoices.find((item) => item.id === this.selectedInvoice?.id) ?? null;
    this.paymentForm.reset({ amount: 0 });
  }

  protected exportReceipt(): void {
    if (!this.selectedInvoice) return;
    this.receiptMessage = `Recu genere pour ${this.selectedInvoice.id}.`;
  }

  protected pickQuickAmount(amount: number): void {
    this.paymentForm.patchValue({ amount });
  }

  protected selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  protected remainingAmount(invoice: InvoiceItem): number {
    return Math.max(0, invoice.amount - invoice.paidAmount);
  }

  protected statusClass(status: InvoiceStatus): 'paid' | 'pending' | 'partial' | 'cancelled' {
    if (status === 'Paid') return 'paid';
    if (status === 'Pending') return 'pending';
    if (status === 'Partial') return 'partial';
    return 'cancelled';
  }
}
