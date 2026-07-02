/**
 * LuminaUI — Form Demo section.
 *
 * A real-world complex form showcasing:
 *  - Masked inputs (CPF, phone, currency)
 *  - Floating labels
 *  - Cross-field validation (password === confirm)
 *  - Async validation (email exists check, simulated)
 *  - validate-on="blur" timing
 *  - Dynamic fields (lumina-form-list for phone numbers)
 *  - Custom error messages via data-msg-*
 *  - Form submit with full payload visible
 */

import type { Route } from '../app';
import { el, sectionHead } from './_shared';

export default async function formDemoSection(_route: Route): Promise<HTMLElement> {
  const root = el('div', { class: 'form-demo' });
  root.innerHTML = `
    ${sectionHead('02', 'Form Demo', 'Formulário complexo: máscaras + validação assíncrona + cross-field + floating label + Form.List dinâmico.').outerHTML}

    <div class="form-demo__layout">
      <div class="form-demo__form">
        <lumina-form id="complex-form" validate-on="blur" accent-color="#7c5cff" theme="dark">
          <h3 class="form-demo__section-title">Dados pessoais</h3>

          <lumina-form-field label="Nome completo" required hint="Como aparece no documento">
            <lumina-input
              slot="control"
              name="nome"
              floating-label
              data-validate="required min:3"
              data-msg-required="Por favor, digite seu nome"
              data-msg-min="Nome muito curto (mínimo 3 caracteres)"
              placeholder="Seu nome"
            ></lumina-input>
            <span slot="error"></span>
          </lumina-form-field>

          <lumina-form-field label="Email" required hint="Mandaremos confirmação (async validation)">
            <lumina-input
              slot="control"
              name="email"
              type="email"
              floating-label
              data-validate="required email"
              data-msg-required="Email é obrigatório"
              data-msg-email="Formato de email inválido"
              placeholder="email@exemplo.com"
            ></lumina-input>
            <span slot="error"></span>
          </lumina-form-field>

          <lumina-form-field label="CPF" hint="Validação real com checksum">
            <lumina-masked-input
              slot="control"
              name="cpf"
              mask="###.###.###-##"
              floating-label
              data-validate="cpf"
              data-msg-cpf="CPF não existe (checksum falhou)"
              placeholder="000.000.000-00"
            ></lumina-masked-input>
            <span slot="error"></span>
          </lumina-form-field>

          <lumina-form-field label="Salário" hint="Formatter de moeda R$">
            <lumina-masked-input
              slot="control"
              name="salario"
              floating-label
              placeholder="R$ 0,00"
            ></lumina-masked-input>
            <span slot="error"></span>
          </lumina-form-field>

          <h3 class="form-demo__section-title">Segurança</h3>

          <lumina-form-field label="Senha" required hint="Mínimo 8 caracteres">
            <lumina-input
              slot="control"
              name="senha"
              type="password"
              data-validate="required min:8"
              data-msg-required="Senha é obrigatória"
              data-msg-min="Senha muito curta (mínimo 8)"
              placeholder="Mínimo 8 caracteres"
            ></lumina-input>
            <span slot="error"></span>
          </lumina-form-field>

          <lumina-form-field label="Confirmar senha" required hint="Deve ser igual à senha">
            <lumina-input
              slot="control"
              name="confirmar"
              type="password"
              data-validate="required match:senha"
              data-msg-required="Confirmação é obrigatória"
              data-msg-match="As senhas não coincidem"
              placeholder="Digite novamente"
            ></lumina-input>
            <span slot="error"></span>
          </lumina-form-field>

          <h3 class="form-demo__section-title">Telefones (Form.List dinâmico)</h3>

          <lumina-form-list id="phones-list" add-label="Adicionar telefone" movable max="3">
            <div data-lfl-item style="display:flex;gap:8px;align-items:center;">
              <lumina-masked-input
                name="telefone[]"
                mask="(##) #####-####"
                placeholder="(00) 00000-0000"
                style="flex:1;"
              ></lumina-masked-input>
            </div>
            <div data-lfl-item style="display:flex;gap:8px;align-items:center;">
              <lumina-masked-input
                name="telefone[]"
                mask="(##) #####-####"
                placeholder="(00) 00000-0000"
                style="flex:1;"
              ></lumina-masked-input>
            </div>
          </lumina-form-list>

          <h3 class="form-demo__section-title">Preferências</h3>

          <lumina-form-field label="Linguagens favoritas" hint="Multi-select com tags">
            <lumina-autocomplete
              slot="control"
              name="langs"
              multi
              memory-key="langs"
              placeholder="Selecione..."
              suggestions='[
                {"value":"ts","label":"TypeScript"},
                {"value":"js","label":"JavaScript"},
                {"value":"py","label":"Python"},
                {"value":"rust","label":"Rust"},
                {"value":"go","label":"Go"},
                {"value":"kt","label":"Kotlin"},
                {"value":"swift","label":"Swift"},
                {"value":"java","label":"Java"},
                {"value":"csharp","label":"C#"},
                {"value":"ruby","label":"Ruby"}
              ]'
            ></lumina-autocomplete>
            <span slot="error"></span>
          </lumina-form-field>

          <lumina-form-field label="Aceito os termos" required>
            <lumina-checkbox
              slot="control"
              name="termos"
              data-validate="required"
              data-msg-required="Você precisa aceitar os termos"
            ></lumina-checkbox>
            <span slot="error"></span>
          </lumina-form-field>
        </lumina-form>
      </div>

      <div class="form-demo__output">
        <h3 class="form-demo__output-title">Output do Submit</h3>
        <p class="form-demo__output-hint">Preencha o formulário e clique em Enviar. O payload (com valores limpos das máscaras) aparece aqui:</p>
        <pre class="form-demo__output-pre" id="form-output">// Aguardando submit...</pre>

        <h3 class="form-demo__output-title" style="margin-top:24px;">Recursos demonstrados</h3>
        <ul class="form-demo__features">
          <li><strong>Máscaras</strong>: CPF, telefone, salário (currency formatter)</li>
          <li><strong>Floating label</strong>: campos CPF e Salário têm floating label animado</li>
          <li><strong>Cross-field</strong>: Confirmar Senha valida contra Senha (regra <code>match:senha</code>)</li>
          <li><strong>Async validation</strong>: Email é verificado contra um "backend" simulado (1s delay)</li>
          <li><strong>validate-on="blur"</strong>: valida cada campo ao perder foco, não só no submit</li>
          <li><strong>Custom messages</strong>: <code>data-msg-required</code>, <code>data-msg-email</code>, etc.</li>
          <li><strong>Form.List dinâmico</strong>: adicionar/remover telefones com animação</li>
          <li><strong>Multi-select</strong>: Autocomplete com tags removíveis</li>
          <li><strong>Micro-interações</strong>: shake no erro, checkmark no sucesso, fade-in da mensagem</li>
        </ul>
      </div>
    </div>
  `;

  // Wire up the form
  const form = root.querySelector('#complex-form') as any;
  const output = root.querySelector('#form-output') as HTMLElement;
  const salarioInput = root.querySelector('[name="salario"]') as any;

  // Set currency formatter on salário
  if (salarioInput && salarioInput.formatter !== undefined) {
    // Import dynamically to avoid circular deps
    import('../../src/core/mask').then(({ currencyFormatter }) => {
      salarioInput.formatter = currencyFormatter('R$', ',', '.');
    });
  }

  // Set async validator on email (simulated backend check)
  if (form && form.setAsyncValidator) {
    form.setAsyncValidator('email', async (value: string) => {
      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 800));
      // Pretend these emails are already registered
      const taken = ['admin@exemplo.com', 'user@exemplo.com', 'test@exemplo.com', 'joao@exemplo.com'];
      if (taken.includes(value.toLowerCase())) {
        return 'Email já cadastrado (simulação de backend)';
      }
      return null;
    });

    // Custom sync validator example: nome cannot be 'admin'
    form.setValidator('nome', (value: string) => {
      if (value.toLowerCase() === 'admin') return 'Nome reservado';
      return null;
    });

    form.addEventListener('lumina-submit', (e: any) => {
      const { values, errors, valid } = e.detail;
      const payload = {
        valid,
        values,
        errors,
        timestamp: new Date().toISOString(),
      };
      output.textContent = JSON.stringify(payload, null, 2);
      output.classList.add('is-updated');
      setTimeout(() => output.classList.remove('is-updated'), 1000);
    });
  }

  return root;
}
