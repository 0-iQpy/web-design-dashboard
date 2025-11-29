    // Sample data (mirrors your bot files)
    const orders = [
      { id: '#2043', customer: '@JohnDoe', items: [{name:'Coke 1.5L', qty:2, price:85}], total:170, status:'Pending', channel:'#buyer-2043' },
      { id: '#2044', customer: '@Maria', items: [{name:'Bread', qty:1, price:25}], total:25, status:'Processing', channel:'#buyer-2044' },
      { id: '#2041', customer: '@Anne', items: [{name:'Snacks', qty:3, price:85}], total:85, status:'Sent', channel:'#buyer-2041' }
    ];

    const inventory = [
      { name: 'Coke 1.5L', price:85, stock:12 },
      { name: 'Bread', price:50, stock:20 },
      { name: 'Soap', price:35, stock:8 }
    ];

    const balances = [
      { username: 'shop_wallet_1', balance:1200 },
      { username: 'shop_wallet_2', balance:540 }
    ];

    const payments = [
      { id:'P-001', user:'@buyer1', amount:250, status:'Waiting' },
      { id:'P-002', user:'@buyer2', amount:120, status:'Waiting' }
    ];

    const vouches = [
      { id:'V-001', user:'@customer', item:'Coke x2' }
    ];

    const logs = [
      '[10:12] Order #2043 updated to Processing',
      '[09:55] @staff signed in'
    ];

    // Render functions
    const ordersListEl = document.getElementById('ordersList');
    const detailEl = document.getElementById('detailContent');
    const invSnap = document.getElementById('invSnap');
    const balSnap = document.getElementById('balSnap');
    const paymentsList = document.getElementById('paymentsList');
    const vouchesList = document.getElementById('vouchesList');
    const logsList = document.getElementById('logsList');

    function renderOrders(filter='All', search=''){
      ordersListEl.innerHTML = '';
      const filtered = orders.filter(o => (filter==='All' || o.status===filter) && (o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase())));
      filtered.forEach(o => {
        const div = document.createElement('div');
        div.className = 'order';
        div.innerHTML = `<div class="meta"><div style="font-weight:600">${o.id} <span style="font-weight:400;color:var(--muted);font-size:13px;margin-left:8px">${o.customer}</span></div><div style="font-size:13px;color:var(--muted);margin-top:6px">${o.items.map(it=>`${it.name} x${it.qty}`).join(', ')}</div></div><div style="text-align:right"><div style="font-weight:700">₱${o.total}</div><div style="margin-top:6px">${statusBadge(o.status)}</div></div>`;
        div.addEventListener('click', ()=>showDetail(o));
        ordersListEl.appendChild(div);
      });
      if(filtered.length===0) ordersListEl.innerHTML = '<div style="color:var(--muted);padding:12px">No orders found</div>';
    }

    function statusBadge(s){
      if(s==='Pending') return `<span class="badge pending">${s}</span>`;
      if(s==='Processing') return `<span class="badge processing">${s}</span>`;
      return `<span class="badge sent">${s}</span>`;
    }

    function showDetail(o){
      detailEl.innerHTML = `<div><div style="display:flex;justify-content:space-between"><div><div style="font-size:13px;color:var(--muted)">Customer</div><div style="font-weight:700">${o.customer}</div></div><div style="text-align:right"><div style="font-size:13px;color:var(--muted)">Total</div><div style="font-weight:700">₱${o.total}</div></div></div><div style="margin-top:10px"><div style="font-size:13px;color:var(--muted)">Items</div><ul class="items-list">${o.items.map(it=>`<li>${it.name} x${it.qty} • ₱${it.price}</li>`).join('')}</ul></div><div class="actions"><button class="btn primary" onclick="markPaid('${o.id}')">Mark Paid</button><button class="btn primary" style="background:#06b6d4" onclick="markSent('${o.id}')">Mark Sent</button><button class="btn ghost" onclick="cancelOrder('${o.id}')">Cancel</button></div></div>`;
    }

    function renderInventory(){
      invSnap.innerHTML = inventory.map(it=>`<div style="display:flex;justify-content:space-between;padding:6px 0">${it.name} <span style="color:var(--muted)">₱${it.price} • ${it.stock} left</span></div>`).join('');
    }
    function renderBalances(){
      balSnap.innerHTML = balances.map(b=>`<div style="display:flex;justify-content:space-between;padding:6px 0">${b.username} <strong>₱${b.balance}</strong></div>`).join('');
    }
    function renderPayments(){
      paymentsList.innerHTML = payments.map(p=>`<div style="padding:6px 0;border-bottom:1px dashed #f1f1f4">${p.id} • ${p.user} • ₱${p.amount} • <em style="color:var(--muted)">${p.status}</em></div>`).join('');
    }
    function renderVouches(){
      vouchesList.innerHTML = vouches.map(v=>`<div style="padding:6px 0;border-bottom:1px dashed #f1f1f4">${v.id} • ${v.user} • ${v.item}</div>`).join('');
    }
    function renderLogs(){
      logsList.innerHTML = logs.map(l=>`<div style="padding:6px 0;border-bottom:1px dashed #f1f1f4">${l}</div>`).join('');
    }

    // Actions
    function markPaid(id){
      const o = orders.find(x=>x.id===id); if(!o) return; o.status='Processing'; renderOrders(document.getElementById('filter').value, document.getElementById('search').value); showDetail(o); addLog(`Order ${id} marked as Paid`);
    }
    function markSent(id){
      const o = orders.find(x=>x.id===id); if(!o) return; o.status='Sent'; renderOrders(document.getElementById('filter').value, document.getElementById('search').value); showDetail(o); addLog(`Order ${id} marked as Sent`);
    }
    function cancelOrder(id){
      const idx = orders.findIndex(x=>x.id===id); if(idx>=0) orders.splice(idx,1); renderOrders(document.getElementById('filter').value, document.getElementById('search').value); detailEl.innerHTML='<div style="color:var(--muted)">No order selected</div>'; addLog(`Order ${id} cancelled`);
    }
    function addLog(msg){ logs.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`); renderLogs(); }

    // Events
    document.getElementById('filter').addEventListener('change', e=>renderOrders(e.target.value, document.getElementById('search').value));
    document.getElementById('search').addEventListener('input', e=>renderOrders(document.getElementById('filter').value, e.target.value));
    document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click', ()=>{ document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); alert('Navigation placeholder — wireframe only'); }));
    document.getElementById('newOrderBtn').addEventListener('click', ()=>alert('New Order (placeholder)'));

    // Initial render
    renderOrders(); 
    renderInventory(); 
    renderBalances();
    renderPayments();
    renderVouches();
    renderLogs();