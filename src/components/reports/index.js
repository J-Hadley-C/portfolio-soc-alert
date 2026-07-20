import RapportEvasion from './RapportEvasion'
import RapportCredentialDumping from './RapportCredentialDumping'
import RapportExfiltration from './RapportExfiltration'
import RapportPhishing from './RapportPhishing'
import RapportAuditZAP from './RapportAuditZAP'

// Associe l'id d'un projet à son composant rapport (rendu HTML dans la modale).
export const REPORTS = {
  1: RapportEvasion,
  2: RapportCredentialDumping,
  3: RapportExfiltration,
  4: RapportPhishing,
  6: RapportAuditZAP,
}
