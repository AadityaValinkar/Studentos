-- update_member_count.sql
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE communities
        SET member_count = member_count + 1
        WHERE id = NEW.community_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE communities
        SET member_count = member_count - 1
        WHERE id = OLD.community_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS community_member_count_trigger ON community_members;

CREATE TRIGGER community_member_count_trigger
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW
EXECUTE FUNCTION update_community_member_count();
